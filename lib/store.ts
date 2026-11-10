import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { authorProfile, categories, works } from "@/lib/data";
import { readingMinutes } from "@/lib/format";
import { uniqueSlug } from "@/lib/slug";
import { deleteUploads } from "@/lib/uploads";
import type {
  AuthorProfile,
  Category,
  CategoryInput,
  StoreData,
  Work,
  WorkFile,
  WorkInput,
  WorkStatus,
  WorkSummary,
} from "@/lib/types";

/**
 * Penyimpanan lokal sementara.
 *
 * Data disimpan sebagai JSON di `.data/store.json` supaya panel admin bisa
 * dipakai tanpa Supabase. File ini hanya untuk pengembangan lokal dan tidak
 * aman untuk deployment multi-instance / serverless.
 */

const STORE_VERSION = 1;
const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(STORE_DIR, "store.json");

export class StoreError extends Error {}

function createSeedStore(): StoreData {
  return structuredClone({
    version: STORE_VERSION,
    categories,
    works,
    profile: authorProfile,
  });
}

function isStoreData(value: unknown): value is StoreData {
  const store = value as StoreData;
  return Boolean(
    store &&
      Array.isArray(store.categories) &&
      Array.isArray(store.works) &&
      store.profile &&
      typeof store.profile.name === "string",
  );
}

function isMissingFile(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

async function persistStore(store: StoreData): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  const temporaryFile = `${STORE_FILE}.${process.pid}.tmp`;
  await fs.writeFile(
    temporaryFile,
    `${JSON.stringify(store, null, 2)}\n`,
    "utf8",
  );

  try {
    await fs.rename(temporaryFile, STORE_FILE);
  } catch {
    await fs.rm(STORE_FILE, { force: true });
    await fs.rename(temporaryFile, STORE_FILE);
  }
}

/* Antrean sederhana agar dua penulisan tidak saling menimpa. */
let writeQueue: Promise<unknown> = Promise.resolve();

function withStoreLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

let seedPromise: Promise<void> | null = null;

function ensureStoreExists(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await fs.access(STORE_FILE);
        return;
      } catch {
        // Belum ada — buat dari data awal.
      }

      await withStoreLock(async () => {
        try {
          await fs.access(STORE_FILE);
          return;
        } catch {
          await persistStore(createSeedStore());
        }
      });
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }

  return seedPromise;
}

async function readStoreFile(): Promise<StoreData> {
  const raw = await fs.readFile(STORE_FILE, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!isStoreData(parsed)) {
    throw new StoreError("Struktur data penyimpanan tidak dikenali.");
  }

  return parsed;
}

async function backupBrokenStore(): Promise<void> {
  const backupFile = path.join(
    STORE_DIR,
    `store.rusak-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );

  try {
    await fs.rename(STORE_FILE, backupFile);
  } catch {
    // Kalau gagal, biarkan; seed akan menimpa.
  }
}

async function readStore(): Promise<StoreData> {
  try {
    await ensureStoreExists();
    return await readStoreFile();
  } catch (error) {
    if (isMissingFile(error)) {
      seedPromise = null;
      await ensureStoreExists();
      return readStoreFile();
    }

    if (error instanceof SyntaxError || error instanceof StoreError) {
      await backupBrokenStore();
      seedPromise = null;
      await ensureStoreExists();
      return readStoreFile();
    }

    throw error;
  }
}

async function mutateStore<T>(
  mutator: (store: StoreData) => T | Promise<T>,
): Promise<T> {
  await ensureStoreExists();

  return withStoreLock(async () => {
    const store = await readStoreFile();
    const result = await mutator(store);
    await persistStore(store);
    return result;
  });
}

/* -------------------------------------------------------------------------- */
/* Pembacaan publik                                                            */
/* -------------------------------------------------------------------------- */

function sortByPublishedDesc(items: Work[]): Work[] {
  return [...items].sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.title.localeCompare(b.title, "id"),
  );
}

function categoryNameMap(store: StoreData): Map<string, string> {
  return new Map(store.categories.map((category) => [category.slug, category.name]));
}

export function toWorkSummary(work: Work, categoryName: string): WorkSummary {
  return {
    slug: work.slug,
    title: work.title,
    category: work.category,
    categoryName,
    excerpt: work.excerpt,
    publishedAt: work.publishedAt,
    readingMinutes: work.content.trim() ? readingMinutes(work.content) : 0,
  };
}

function publishedFromStore(store: StoreData): Work[] {
  return sortByPublishedDesc(
    store.works.filter((work) => work.status === "published"),
  );
}

function summariesFromStore(store: StoreData): WorkSummary[] {
  const names = categoryNameMap(store);
  return publishedFromStore(store).map((work) =>
    toWorkSummary(work, names.get(work.category) ?? work.category),
  );
}

export async function getPublishedWorks(): Promise<Work[]> {
  return publishedFromStore(await readStore());
}

export async function getPublishedSummaries(): Promise<WorkSummary[]> {
  return summariesFromStore(await readStore());
}

export async function getFeaturedWork(): Promise<Work | undefined> {
  const published = await getPublishedWorks();
  return published.find((work) => work.featured) ?? published[0];
}

export async function getCategories(): Promise<Category[]> {
  return (await readStore()).categories;
}

export async function getCategoriesWithCounts(): Promise<
  Array<Category & { count: number }>
> {
  const store = await readStore();
  const counts = new Map<string, number>();

  for (const work of store.works) {
    if (work.status !== "published") continue;
    counts.set(work.category, (counts.get(work.category) ?? 0) + 1);
  }

  return store.categories.map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const store = await readStore();
  return store.categories.find((category) => category.slug === slug);
}

export async function getAuthorProfile(): Promise<AuthorProfile> {
  return (await readStore()).profile;
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  const store = await readStore();
  return store.works.find(
    (work) => work.slug === slug && work.status === "published",
  );
}

export async function getWorkById(id: string): Promise<Work | undefined> {
  const store = await readStore();
  return store.works.find((work) => work.id === id);
}

export async function getWorkFileById(
  fileId: string,
): Promise<{ work: Work; file: WorkFile } | undefined> {
  const store = await readStore();

  for (const work of store.works) {
    const file = work.files?.find((item) => item.id === fileId);
    if (file) return { work, file };
  }

  return undefined;
}

export async function getAllWorks(): Promise<Work[]> {
  return sortByPublishedDesc((await readStore()).works);
}

export async function getWorkCounts(): Promise<{
  total: number;
  published: number;
  draft: number;
  categories: number;
}> {
  const store = await readStore();
  const published = store.works.filter(
    (work) => work.status === "published",
  ).length;

  return {
    total: store.works.length,
    published,
    draft: store.works.length - published,
    categories: store.categories.length,
  };
}

export async function getAdjacentWorks(slug: string): Promise<{
  newer?: WorkSummary;
  older?: WorkSummary;
}> {
  const store = await readStore();
  const summaries = summariesFromStore(store);
  const index = summaries.findIndex((work) => work.slug === slug);

  if (index === -1) return {};

  return {
    newer: index > 0 ? summaries[index - 1] : undefined,
    older: index < summaries.length - 1 ? summaries[index + 1] : undefined,
  };
}

export async function getRelatedWorks(
  slug: string,
  limit = 3,
): Promise<WorkSummary[]> {
  const store = await readStore();
  const names = categoryNameMap(store);
  const current = publishedFromStore(store).find((work) => work.slug === slug);

  if (!current) return [];

  const published = publishedFromStore(store);
  const sameCategory = published.filter(
    (work) => work.slug !== slug && work.category === current.category,
  );
  const others = published.filter(
    (work) => work.slug !== slug && work.category !== current.category,
  );

  return [...sameCategory, ...others]
    .slice(0, limit)
    .map((work) => toWorkSummary(work, names.get(work.category) ?? work.category));
}

/* -------------------------------------------------------------------------- */
/* Penulisan admin                                                             */
/* -------------------------------------------------------------------------- */

export async function saveWork(input: WorkInput): Promise<Work> {
  return mutateStore((store) => {
    const title = input.title.trim();
    const excerpt = input.excerpt.trim();
    const content = input.content.trim();
    const files = input.files ?? [];
    const category = store.categories.find(
      (item) => item.slug === input.category,
    );

    if (!title) throw new StoreError("Judul karya wajib diisi.");
    if (!category) throw new StoreError("Kategori yang dipilih tidak ada.");
    if (!excerpt) throw new StoreError("Ringkasan karya wajib diisi.");
    if (!content && files.length === 0) {
      throw new StoreError("Isi karya atau berkas karya wajib diisi.");
    }

    const existingSlugs = store.works
      .filter((work) => work.id !== input.id)
      .map((work) => work.slug);
    const slug = uniqueSlug(input.slug?.trim() || title, existingSlugs);

    if (input.featured) {
      for (const work of store.works) {
        if (work.id !== input.id) work.featured = false;
      }
    }

    if (input.id) {
      const existing = store.works.find((work) => work.id === input.id);
      if (!existing) throw new StoreError("Karya tidak ditemukan.");

      existing.title = title;
      existing.slug = slug;
      existing.category = category.slug;
      existing.excerpt = excerpt;
      existing.content = content;
      existing.publishedAt = input.publishedAt;
      existing.status = input.status;
      existing.featured = input.featured;
      existing.files = files;
      existing.updatedAt = new Date().toISOString();

      return existing;
    }

    const work: Work = {
      id: `w-${randomUUID().slice(0, 8)}`,
      title,
      slug,
      category: category.slug,
      excerpt,
      content,
      publishedAt: input.publishedAt,
      status: input.status,
      featured: input.featured,
      files,
      updatedAt: new Date().toISOString(),
    };

    store.works.push(work);
    return work;
  });
}

export async function deleteWork(id: string): Promise<void> {
  const removedFiles = await mutateStore((store) => {
    const index = store.works.findIndex((work) => work.id === id);
    if (index === -1) throw new StoreError("Karya tidak ditemukan.");

    const [removed] = store.works.splice(index, 1);
    return removed.files ?? [];
  });

  await deleteUploads(removedFiles);
}

export async function setWorkStatus(
  id: string,
  status: WorkStatus,
): Promise<void> {
  await mutateStore((store) => {
    const work = store.works.find((item) => item.id === id);
    if (!work) throw new StoreError("Karya tidak ditemukan.");
    work.status = status;
    work.updatedAt = new Date().toISOString();
  });
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  return mutateStore((store) => {
    const name = input.name.trim();

    if (!name) throw new StoreError("Nama kategori wajib diisi.");

    const duplicate = store.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      throw new StoreError("Kategori dengan nama itu sudah ada.");
    }

    const slug = uniqueSlug(
      input.slug?.trim() || name,
      store.categories.map((category) => category.slug),
      undefined,
      "kategori",
    );

    const category: Category = {
      slug,
      name,
      description: input.description.trim(),
    };

    store.categories.push(category);
    return category;
  });
}

export async function deleteCategory(slug: string): Promise<void> {
  await mutateStore((store) => {
    const used = store.works.filter((work) => work.category === slug).length;
    if (used > 0) {
      throw new StoreError(
        `Kategori ini masih dipakai oleh ${used} karya. Pindahkan karya terlebih dahulu.`,
      );
    }

    const index = store.categories.findIndex(
      (category) => category.slug === slug,
    );
    if (index === -1) throw new StoreError("Kategori tidak ditemukan.");

    store.categories.splice(index, 1);
  });
}

export async function updateAuthorProfile(
  profile: AuthorProfile,
): Promise<void> {
  await mutateStore((store) => {
    store.profile = profile;
  });
}
