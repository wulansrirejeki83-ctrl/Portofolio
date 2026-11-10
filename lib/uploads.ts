import "server-only";

import { randomUUID } from "node:crypto";
import {
  MAX_FILES_PER_WORK,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  MIME_BY_EXTENSION,
  normalizeExtension,
  uploadExtension,
  type UploadExtension,
} from "@/lib/upload-rules";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import type { WorkFile } from "@/lib/types";

export const BUCKET_NAME = "berkas-karya";

export class UploadError extends Error {}

function displayName(name: string): string {
  const cleaned = name
    .replace(/[\\/]/g, "_")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 160);

  return cleaned || "berkas";
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function hasValidSignature(extension: UploadExtension, bytes: Uint8Array): boolean {
  switch (extension) {
    case "pdf":
      return startsWith(bytes, [0x25, 0x50, 0x44, 0x46]); // %PDF
    case "png":
      return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]); // ‰PNG
    case "jpg":
    case "jpeg":
      return startsWith(bytes, [0xff, 0xd8, 0xff]); // JPEG
    case "webp":
      return (
        startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && // RIFF
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50 // WEBP
      );
    case "docx":
      return startsWith(bytes, [0x50, 0x4b]); // ZIP (OOXML)
    case "doc":
      return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0]); // OLE
    default:
      return false;
  }
}

async function getStorageClient() {
  try {
    return createServiceClient();
  } catch {
    return await createServerSupabase();
  }
}

/**
 * Validasi lalu simpan berkas baru ke Supabase Storage.
 * Mengembalikan metadata WorkFile yang siap disimpan ke database.
 */
export async function saveUploads(
  files: File[],
  existingCount = 0,
): Promise<WorkFile[]> {
  const incoming = files.filter((file) => file.size > 0);
  if (incoming.length === 0) return [];

  if (existingCount + incoming.length > MAX_FILES_PER_WORK) {
    throw new UploadError(
      `Maksimal ${MAX_FILES_PER_WORK} berkas per karya. Hapus beberapa berkas lama terlebih dahulu.`,
    );
  }

  const prepared: Array<{ meta: WorkFile; buffer: Buffer }> = [];

  for (const file of incoming) {
    const extension = uploadExtension(file.name);

    if (!extension) {
      throw new UploadError(
        `Format berkas "${file.name}" tidak didukung. Gunakan PDF, DOC, DOCX, PNG, JPG, atau WebP.`,
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      throw new UploadError(
        `Berkas "${file.name}" melebihi batas ${MAX_UPLOAD_MB} MB.`,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!hasValidSignature(extension, buffer)) {
      throw new UploadError(
        `Isi berkas "${file.name}" tidak cocok dengan format .${extension}.`,
      );
    }

    prepared.push({
      meta: {
        id: randomUUID(),
        name: displayName(file.name),
        mime: MIME_BY_EXTENSION[extension],
        size: buffer.length,
        extension,
      },
      buffer,
    });
  }

  const supabase = await getStorageClient();
  const uploadedFiles: WorkFile[] = [];

  try {
    for (const item of prepared) {
      const storagePath = `${item.meta.id}.${item.meta.extension}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, item.buffer, {
          contentType: item.meta.mime,
          upsert: true,
        });

      if (error) {
        throw new UploadError(`Gagal mengunggah berkas: ${error.message}`);
      }

      uploadedFiles.push(item.meta);
    }
  } catch (error) {
    await deleteUploads(uploadedFiles);
    throw error;
  }

  return uploadedFiles;
}

/**
 * Hapus berkas dari Supabase Storage.
 */
export async function deleteUploads(files: WorkFile[]): Promise<void> {
  if (files.length === 0) return;

  const supabase = await getStorageClient();
  const paths = files.map((f) => {
    const ext = normalizeExtension(f.extension) ?? "bin";
    return `${f.id}.${ext}`;
  });

  await supabase.storage.from(BUCKET_NAME).remove(paths);
}

/**
 * Baca isi buffer berkas dari Supabase Storage.
 */
export async function readUpload(file: WorkFile): Promise<Buffer> {
  const supabase = await getStorageClient();
  const ext = normalizeExtension(file.extension) ?? "bin";
  const storagePath = `${file.id}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(storagePath);

  if (error || !data) {
    throw new UploadError(`Berkas tidak dapat diunduh: ${error?.message}`);
  }

  return Buffer.from(await data.arrayBuffer());
}
