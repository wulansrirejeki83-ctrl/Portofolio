import "server-only";

import { randomUUID } from "node:crypto";
import { readingMinutes } from "@/lib/format";
import { uniqueSlug } from "@/lib/slug";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { deleteUploads } from "@/lib/uploads";
import type {
  AuthorProfile,
  Category,
  CategoryInput,
  Work,
  WorkFile,
  WorkInput,
  WorkStatus,
  WorkSummary,
} from "@/lib/types";

export class StoreError extends Error {}

/**
 * Helper untuk mendapatkan Supabase client:
 * - Jika `useAdmin` = true atau ada SERVICE_ROLE_KEY, gunakan service role untuk mutasi / bypass RLS
 * - Jika tidak, gunakan createServerSupabase() dengan anon key & cookie
 */
async function getSupabase(useAdmin = false) {
  if (useAdmin) {
    try {
      return createServiceClient();
    } catch {
      // Fallback ke server client jika SERVICE_ROLE_KEY belum disetel
      return await createServerSupabase();
    }
  }
  return await createServerSupabase();
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

/* -------------------------------------------------------------------------- */
/* Pembacaan Publik                                                           */
/* -------------------------------------------------------------------------- */

export async function getPublishedWorks(): Promise<Work[]> {
  const supabase = await getSupabase(false);
  const { data, error } = await supabase
    .from("works")
    .select("*, work_files(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new StoreError(`Gagal mengambil karya: ${error.message}`);

  return (data ?? []).map(mapWorkRow);
}

export async function getPublishedSummaries(): Promise<WorkSummary[]> {
  const [works, categories] = await Promise.all([
    getPublishedWorks(),
    getCategories(),
  ]);

  const catMap = new Map(categories.map((c) => [c.slug, c.name]));
  return works.map((w) => toWorkSummary(w, catMap.get(w.category) ?? w.category));
}

export async function getFeaturedWork(): Promise<Work | undefined> {
  const published = await getPublishedWorks();
  return published.find((work) => work.featured) ?? published[0];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getSupabase(false);
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new StoreError(`Gagal mengambil kategori: ${error.message}`);
  return data ?? [];
}

export async function getCategoriesWithCounts(): Promise<
  Array<Category & { count: number }>
> {
  const [categories, publishedWorks] = await Promise.all([
    getCategories(),
    getPublishedWorks(),
  ]);

  const counts = new Map<string, number>();
  for (const work of publishedWorks) {
    counts.set(work.category, (counts.get(work.category) ?? 0) + 1);
  }

  return categories.map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const supabase = await getSupabase(false);
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new StoreError(`Gagal mengambil kategori: ${error.message}`);
  return data ?? undefined;
}

export async function getAuthorProfile(): Promise<AuthorProfile> {
  const supabase = await getSupabase(false);
  const { data, error } = await supabase
    .from("author_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new StoreError(`Gagal mengambil profil: ${error.message}`);
  if (!data) {
    throw new StoreError("Profil penulis belum ada di database.");
  }

  return {
    name: data.name,
    initials: data.initials,
    role: data.role,
    location: data.location,
    shortBio: data.short_bio,
    bio: Array.isArray(data.bio) ? data.bio : [],
    quote: data.quote,
    experience: Array.isArray(data.experience) ? data.experience : [],
    publications: Array.isArray(data.publications) ? data.publications : [],
  };
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  const supabase = await getSupabase(false);
  const { data, error } = await supabase
    .from("works")
    .select("*, work_files(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new StoreError(`Gagal mengambil karya: ${error.message}`);
  return data ? mapWorkRow(data) : undefined;
}

export async function getWorkById(id: string): Promise<Work | undefined> {
  const supabase = await getSupabase(true);
  const { data, error } = await supabase
    .from("works")
    .select("*, work_files(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new StoreError(`Gagal mengambil karya: ${error.message}`);
  return data ? mapWorkRow(data) : undefined;
}

export async function getWorkFileById(
  fileId: string,
): Promise<{ work: Work; file: WorkFile } | undefined> {
  const supabase = await getSupabase(true);
  const { data, error } = await supabase
    .from("work_files")
    .select("*, works(*, work_files(*))")
    .eq("id", fileId)
    .maybeSingle();

  if (error || !data || !data.works) return undefined;

  const work = mapWorkRow(data.works);
  const file: WorkFile = {
    id: data.id,
    name: data.name,
    mime: data.mime,
    size: Number(data.size),
    extension: data.extension,
  };

  return { work, file };
}

export async function getAllWorks(): Promise<Work[]> {
  const supabase = await getSupabase(true);
  const { data, error } = await supabase
    .from("works")
    .select("*, work_files(*)")
    .order("published_at", { ascending: false });

  if (error) throw new StoreError(`Gagal mengambil semua karya: ${error.message}`);
  return (data ?? []).map(mapWorkRow);
}

export async function getWorkCounts(): Promise<{
  total: number;
  published: number;
  draft: number;
  categories: number;
}> {
  const [works, categories] = await Promise.all([
    getAllWorks(),
    getCategories(),
  ]);

  const published = works.filter((work) => work.status === "published").length;
  return {
    total: works.length,
    published,
    draft: works.length - published,
    categories: categories.length,
  };
}

export async function getAdjacentWorks(slug: string): Promise<{
  newer?: WorkSummary;
  older?: WorkSummary;
}> {
  const summaries = await getPublishedSummaries();
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
  const published = await getPublishedWorks();
  const current = published.find((work) => work.slug === slug);
  if (!current) return [];

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  const sameCategory = published.filter(
    (work) => work.slug !== slug && work.category === current.category,
  );
  const others = published.filter(
    (work) => work.slug !== slug && work.category !== current.category,
  );

  return [...sameCategory, ...others]
    .slice(0, limit)
    .map((work) => toWorkSummary(work, catMap.get(work.category) ?? work.category));
}

/* -------------------------------------------------------------------------- */
/* Mutasi Admin (Supabase via Service Role / Client)                          */
/* -------------------------------------------------------------------------- */

export async function saveWork(input: WorkInput): Promise<Work> {
  const supabase = await getSupabase(true);
  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();
  const files = input.files ?? [];

  if (!title) throw new StoreError("Judul karya wajib diisi.");
  if (!input.category) throw new StoreError("Kategori karya wajib diisi.");
  if (!excerpt) throw new StoreError("Ringkasan karya wajib diisi.");
  if (!content && files.length === 0) {
    throw new StoreError("Isi karya atau berkas karya wajib diisi.");
  }

  // Dapatkan existing slugs untuk menjamin keunikan
  const { data: allWorks } = await supabase
    .from("works")
    .select("id, slug");

  const existingSlugs = (allWorks ?? [])
    .filter((w) => w.id !== input.id)
    .map((w) => w.slug);
  const slug = uniqueSlug(input.slug?.trim() || title, existingSlugs);

  // Jika featured = true, unfeatured karya lainnya
  if (input.featured) {
    await supabase.from("works").update({ featured: false }).neq("id", input.id || "");
  }

  const workId = input.id || `w-${randomUUID().slice(0, 8)}`;

  const workPayload = {
    id: workId,
    title,
    slug,
    category: input.category,
    excerpt,
    content,
    published_at: input.publishedAt,
    status: input.status,
    featured: input.featured,
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from("works")
    .upsert(workPayload);

  if (upsertError) {
    throw new StoreError(`Gagal menyimpan karya: ${upsertError.message}`);
  }

  // Simpan / update metadata files ke tabel work_files
  if (files.length > 0) {
    const fileRows = files.map((f) => ({
      id: f.id,
      work_id: workId,
      name: f.name,
      mime: f.mime,
      size: f.size,
      extension: f.extension,
      storage_path: `${workId}/${f.id}.${f.extension}`,
    }));

    const { error: fileError } = await supabase
      .from("work_files")
      .upsert(fileRows);

    if (fileError) {
      throw new StoreError(`Gagal menyimpan data berkas: ${fileError.message}`);
    }
  }

  const saved = await getWorkById(workId);
  if (!saved) throw new StoreError("Karya gagal dimuat setelah disimpan.");
  return saved;
}

export async function deleteWork(id: string): Promise<void> {
  const supabase = await getSupabase(true);
  const work = await getWorkById(id);

  if (!work) throw new StoreError("Karya tidak ditemukan.");

  // Hapus berkas fisik dari storage jika ada
  if (work.files && work.files.length > 0) {
    await deleteUploads(work.files);
  }

  const { error } = await supabase.from("works").delete().eq("id", id);
  if (error) throw new StoreError(`Gagal menghapus karya: ${error.message}`);
}

export async function setWorkStatus(
  id: string,
  status: WorkStatus,
): Promise<void> {
  const supabase = await getSupabase(true);
  const { error } = await supabase
    .from("works")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new StoreError(`Gagal mengubah status: ${error.message}`);
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const supabase = await getSupabase(true);
  const name = input.name.trim();

  if (!name) throw new StoreError("Nama kategori wajib diisi.");

  const categories = await getCategories();
  const duplicate = categories.some(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) throw new StoreError("Kategori dengan nama itu sudah ada.");

  const slug = uniqueSlug(
    input.slug?.trim() || name,
    categories.map((c) => c.slug),
    undefined,
    "kategori",
  );

  const newCat: Category = {
    slug,
    name,
    description: input.description.trim(),
  };

  const { error } = await supabase.from("categories").insert(newCat);
  if (error) throw new StoreError(`Gagal menambah kategori: ${error.message}`);

  return newCat;
}

export async function deleteCategory(slug: string): Promise<void> {
  const supabase = await getSupabase(true);

  // Pastikan tidak ada karya di kategori ini
  const { data: usedWorks } = await supabase
    .from("works")
    .select("id")
    .eq("category", slug);

  if (usedWorks && usedWorks.length > 0) {
    throw new StoreError(
      `Kategori ini masih dipakai oleh ${usedWorks.length} karya. Pindahkan karya terlebih dahulu.`,
    );
  }

  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error) throw new StoreError(`Gagal menghapus kategori: ${error.message}`);
}

export async function updateAuthorProfile(
  profile: AuthorProfile,
): Promise<void> {
  const supabase = await getSupabase(true);
  const payload = {
    id: 1,
    name: profile.name,
    initials: profile.initials,
    role: profile.role,
    location: profile.location,
    short_bio: profile.shortBio,
    bio: profile.bio,
    quote: profile.quote,
    experience: profile.experience,
    publications: profile.publications,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("author_profile").upsert(payload);
  if (error) throw new StoreError(`Gagal menyimpan profil: ${error.message}`);
}

/* -------------------------------------------------------------------------- */
/* Helper Mapper Row DB -> TypeScript Model                                   */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWorkRow(row: any): Work {
  const filesList: WorkFile[] = Array.isArray(row.work_files)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? row.work_files.map((f: any) => ({
        id: f.id,
        name: f.name,
        mime: f.mime,
        size: Number(f.size),
        extension: f.extension,
      }))
    : [];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content ?? "",
    publishedAt: row.published_at,
    featured: Boolean(row.featured),
    status: row.status as WorkStatus,
    files: filesList,
    updatedAt: row.updated_at,
  };
}
