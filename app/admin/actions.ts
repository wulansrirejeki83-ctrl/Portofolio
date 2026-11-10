"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type ActionState } from "@/lib/action-state";
import {
  endSession,
  requireAdmin,
  startSession,
  verifyCredentials,
} from "@/lib/auth";
import {
  createCategory,
  deleteCategory,
  deleteWork,
  getWorkById,
  saveWork,
  setWorkStatus,
  updateAuthorProfile,
} from "@/lib/store";
import { deleteUploads, saveUploads, UploadError } from "@/lib/uploads";
import { MAX_FILES_PER_WORK } from "@/lib/upload-rules";
import type {
  AuthorProfile,
  Experience,
  Publication,
  WorkFile,
  WorkStatus,
} from "@/lib/types";

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function revalidatePublicData(): void {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

function safeAdminRedirect(value: string): string {
  if (
    value.startsWith("/admin") &&
    !value.startsWith("/admin/login") &&
    !value.startsWith("//")
  ) {
    return value;
  }
  return "/admin";
}

/* -------------------------------------------------------------------------- */
/* Autentikasi                                                                 */
/* -------------------------------------------------------------------------- */

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeAdminRedirect(field(formData, "next"));

  if (!email || !password) {
    return {
      status: "error",
      message: "Email dan kata sandi wajib diisi.",
    };
  }

  if (!verifyCredentials(email, password)) {
    return {
      status: "error",
      message: "Email atau kata sandi tidak cocok. Coba lagi.",
    };
  }

  await startSession(email);
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login?keluar=1");
}

/* -------------------------------------------------------------------------- */
/* Karya                                                                       */
/* -------------------------------------------------------------------------- */

export async function saveWorkAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = field(formData, "id") || undefined;
  const title = field(formData, "title");
  const slug = field(formData, "slug");
  const category = field(formData, "category");
  const excerpt = field(formData, "excerpt");
  const content = String(formData.get("content") ?? "").trim();
  const publishedAt =
    field(formData, "publishedAt") || new Date().toISOString().slice(0, 10);
  const status: WorkStatus =
    field(formData, "status") === "draft" ? "draft" : "published";
  const featured = formData.get("featured") === "on";
  const uploads = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const removeIds = new Set(
    formData.getAll("removeFile").map((value) => String(value)),
  );

  const currentWork = id ? await getWorkById(id) : undefined;
  if (id && !currentWork) {
    return { status: "error", message: "Karya tidak ditemukan." };
  }

  const existingFiles = (currentWork?.files ?? []).filter(
    (file) => !removeIds.has(file.id),
  );
  const removedFiles = (currentWork?.files ?? []).filter((file) =>
    removeIds.has(file.id),
  );
  const totalFiles = existingFiles.length + uploads.length;

  const fieldErrors: Record<string, string> = {};

  if (title.length < 3) {
    fieldErrors.title = "Judul minimal 3 karakter.";
  }
  if (!category) {
    fieldErrors.category = "Pilih salah satu kategori.";
  }
  if (!excerpt) {
    fieldErrors.excerpt = "Ringkasan wajib diisi.";
  }
  if (!content && totalFiles === 0) {
    fieldErrors.content =
      "Isi karya wajib diisi, atau lampirkan setidaknya satu berkas.";
  }
  if (totalFiles > MAX_FILES_PER_WORK) {
    fieldErrors.files = `Maksimal ${MAX_FILES_PER_WORK} berkas per karya.`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    fieldErrors.publishedAt = "Gunakan format tanggal yang benar.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Periksa kembali isian yang ditandai.",
      fieldErrors,
    };
  }

  let addedFiles: WorkFile[] = [];

  try {
    addedFiles = await saveUploads(uploads, existingFiles.length);
    await saveWork({
      id,
      title,
      slug,
      category,
      excerpt,
      content,
      publishedAt,
      status,
      featured,
      files: [...existingFiles, ...addedFiles],
    });
  } catch (error) {
    await deleteUploads(addedFiles);
    return {
      status: "error",
      message: messageFrom(error, "Karya gagal disimpan."),
      fieldErrors:
        error instanceof UploadError ? { files: error.message } : undefined,
    };
  }

  await deleteUploads(removedFiles);

  revalidatePublicData();
  redirect(`/admin/karya?simpan=1`);
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = field(formData, "id");

  try {
    await deleteWork(id);
  } catch (error) {
    redirect(
      `/admin/karya?error=${encodeURIComponent(
        messageFrom(error, "Karya gagal dihapus."),
      )}`,
    );
  }

  revalidatePublicData();
  redirect("/admin/karya?hapus=1");
}

export async function setWorkStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = field(formData, "id");
  const status: WorkStatus =
    field(formData, "status") === "draft" ? "draft" : "published";

  try {
    await setWorkStatus(id, status);
  } catch (error) {
    redirect(
      `/admin/karya?error=${encodeURIComponent(
        messageFrom(error, "Status karya gagal diubah."),
      )}`,
    );
  }

  revalidatePublicData();
  redirect(
    `/admin/karya?status=${status === "published" ? "terbit" : "draf"}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Kategori                                                                    */
/* -------------------------------------------------------------------------- */

export async function saveCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = field(formData, "name");
  const slug = field(formData, "slug");
  const description = field(formData, "description");

  if (!name) {
    return {
      status: "error",
      message: "Nama kategori wajib diisi.",
      fieldErrors: { name: "Nama kategori wajib diisi." },
    };
  }

  try {
    await createCategory({ name, slug, description });
  } catch (error) {
    return {
      status: "error",
      message: messageFrom(error, "Kategori gagal ditambahkan."),
    };
  }

  revalidatePublicData();
  redirect("/admin/kategori?simpan=1");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = field(formData, "slug");

  try {
    await deleteCategory(slug);
  } catch (error) {
    redirect(
      `/admin/kategori?error=${encodeURIComponent(
        messageFrom(error, "Kategori gagal dihapus."),
      )}`,
    );
  }

  revalidatePublicData();
  redirect("/admin/kategori?hapus=1");
}

/* -------------------------------------------------------------------------- */
/* Profil                                                                      */
/* -------------------------------------------------------------------------- */

function parseExperience(raw: FormDataEntryValue | null): Experience[] {
  if (typeof raw !== "string" || !raw.trim()) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        period: String(row?.period ?? "").trim(),
        title: String(row?.title ?? "").trim(),
        place: String(row?.place ?? "").trim(),
        description: String(row?.description ?? "").trim(),
      };
    })
    .filter((item) => item.title || item.place);
}

function parsePublications(raw: FormDataEntryValue | null): Publication[] {
  if (typeof raw !== "string" || !raw.trim()) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        year: String(row?.year ?? "").trim(),
        title: String(row?.title ?? "").trim(),
        note: String(row?.note ?? "").trim(),
      };
    })
    .filter((item) => item.title);
}

export async function saveProfileAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = field(formData, "name");
  const initials = field(formData, "initials");
  const role = field(formData, "role");
  const location = field(formData, "location");
  const shortBio = field(formData, "shortBio");
  const quote = field(formData, "quote");
  const bio = String(formData.get("bio") ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nama wajib diisi.";
  if (!initials) fieldErrors.initials = "Inisial wajib diisi.";
  if (!role) fieldErrors.role = "Peran wajib diisi.";
  if (!shortBio) fieldErrors.shortBio = "Bio singkat wajib diisi.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Periksa kembali isian yang ditandai.",
      fieldErrors,
    };
  }

  let experience: Experience[] = [];
  let publications: Publication[] = [];

  try {
    experience = parseExperience(formData.get("experience"));
    publications = parsePublications(formData.get("publications"));
  } catch {
    return {
      status: "error",
      message: "Format data pengalaman atau publikasi tidak valid.",
    };
  }

  const emptyExperience = experience.some((item) => !item.title);
  if (emptyExperience) {
    return {
      status: "error",
      message: "Setiap baris pengalaman harus punya judul.",
    };
  }

  const profile: AuthorProfile = {
    name,
    initials,
    role,
    location,
    shortBio,
    bio,
    quote,
    experience,
    publications,
  };

  try {
    await updateAuthorProfile(profile);
  } catch (error) {
    return {
      status: "error",
      message: messageFrom(error, "Profil gagal disimpan."),
    };
  }

  revalidatePublicData();
  redirect("/admin/profil?simpan=1");
}
