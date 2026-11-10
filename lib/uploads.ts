import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  MAX_FILES_PER_WORK,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  MIME_BY_EXTENSION,
  normalizeExtension,
  uploadExtension,
  type UploadExtension,
} from "@/lib/upload-rules";
import type { WorkFile } from "@/lib/types";

/**
 * Penyimpanan berkas karya di `.data/uploads`.
 * Hanya untuk pengembangan lokal, sama seperti `.data/store.json`.
 */
export const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

const SAFE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function storedFileName(file: WorkFile): string {
  const id = SAFE_ID.test(file.id) ? file.id : "invalid";
  const extension = normalizeExtension(file.extension) ?? "bin";
  return `${id}.${extension}`;
}

function storedPath(file: WorkFile): string {
  return path.join(UPLOAD_DIR, storedFileName(file));
}

/**
 * Validasi lalu simpan berkas baru. Mengembalikan metadata yang siap
 * dimasukkan ke data karya.
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

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    for (const item of prepared) {
      await fs.writeFile(path.join(UPLOAD_DIR, storedFileName(item.meta)), item.buffer);
    }
  } catch (error) {
    await deleteUploads(prepared.map((item) => item.meta));
    throw error;
  }

  return prepared.map((item) => item.meta);
}

export async function deleteUploads(files: WorkFile[]): Promise<void> {
  if (files.length === 0) return;

  await Promise.allSettled(
    files.map((file) => fs.rm(storedPath(file), { force: true })),
  );
}

export async function readUpload(file: WorkFile): Promise<Buffer> {
  return fs.readFile(storedPath(file));
}
