/**
 * Aturan unggah berkas yang dipakai di server maupun client.
 * Modul ini tidak boleh mengimpor `node:*` atau `server-only`.
 */

export const ACCEPTED_UPLOAD_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
] as const;

export type UploadExtension = (typeof ACCEPTED_UPLOAD_EXTENSIONS)[number];

export const UPLOAD_ACCEPT = ACCEPTED_UPLOAD_EXTENSIONS.map(
  (extension) => `.${extension}`,
).join(",");

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_UPLOAD_MB = 15;
export const MAX_FILES_PER_WORK = 8;

export const MIME_BY_EXTENSION: Record<UploadExtension, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export const LABEL_BY_EXTENSION: Record<UploadExtension, string> = {
  pdf: "PDF",
  doc: "Word",
  docx: "Word",
  png: "PNG",
  jpg: "JPG",
  jpeg: "JPG",
  webp: "WebP",
};

export type WorkFileKind = "image" | "pdf" | "document";

export function normalizeExtension(value: string): UploadExtension | null {
  const extension = value.toLowerCase();
  return extension in MIME_BY_EXTENSION
    ? (extension as UploadExtension)
    : null;
}

export function rawExtension(name: string): string {
  const index = name.lastIndexOf(".");
  if (index === -1 || index === name.length - 1) return "";
  return name.slice(index + 1).toLowerCase();
}

export function uploadExtension(name: string): UploadExtension | null {
  return normalizeExtension(rawExtension(name));
}

export function fileKind(mime: string): WorkFileKind {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "document";
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  const megabytes = bytes / (1024 * 1024);
  return `${megabytes >= 10 ? Math.round(megabytes) : megabytes.toFixed(1)} MB`;
}
