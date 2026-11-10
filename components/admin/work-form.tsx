"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  ImageIcon,
  LoaderCircle,
  Paperclip,
  Sparkles,
  Upload,
} from "lucide-react";

import { saveWorkAction } from "@/app/admin/actions";
import { Notice } from "@/components/admin/notice";
import { StatusBadge } from "@/components/admin/status-badge";
import { initialActionState } from "@/lib/action-state";
import { slugify } from "@/lib/slug";
import {
  fileKind,
  formatBytes,
  MAX_FILES_PER_WORK,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  UPLOAD_ACCEPT,
} from "@/lib/upload-rules";
import type { Category, Work } from "@/lib/types";

interface WorkFormProps {
  categories: Category[];
  work?: Work;
}

const inputClass =
  "w-full border border-line bg-paper px-3.5 py-2.5 font-serif text-sm text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none";
const labelClass = "text-[10px] uppercase tracking-[0.2em] text-mute";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-serif text-xs text-accent">{message}</p>;
}

export function WorkForm({ categories, work }: WorkFormProps) {
  const [state, formAction, pending] = useActionState(
    saveWorkAction,
    initialActionState,
  );

  const [title, setTitle] = useState(work?.title ?? "");
  const [slug, setSlug] = useState(work?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(work?.slug));
  const [content, setContent] = useState(work?.content ?? "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const existingFiles = work?.files ?? [];
  const totalFiles = existingFiles.length + selectedFiles.length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 180));
  const defaultDate = work?.publishedAt ?? new Date().toISOString().slice(0, 10);

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const remaining = MAX_FILES_PER_WORK - existingFiles.length;
    const oversized = files.find((file) => file.size > MAX_UPLOAD_BYTES);

    setSelectedFiles(files);

    if (files.length > remaining) {
      setFileError(
        `Maksimal ${MAX_FILES_PER_WORK} berkas per karya. Anda hanya bisa menambah ${Math.max(
          remaining,
          0,
        )} berkas lagi.`,
      );
      return;
    }

    if (oversized) {
      setFileError(
        `Berkas "${oversized.name}" melebihi batas ${MAX_UPLOAD_MB} MB.`,
      );
      return;
    }

    setFileError(null);
  }

  return (
    <form
      action={formAction}
      className="mt-8"
      onSubmit={(event) => {
        if (fileError) event.preventDefault();
      }}
    >
      {work ? <input type="hidden" name="id" value={work.id} /> : null}

      {state.status === "error" && state.message ? (
        <Notice tone="error" className="mb-6">
          {state.message}
        </Notice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div className="space-y-6">
          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Isi karya
              </p>
              {work ? <StatusBadge status={work.status} /> : null}
            </div>

            <div className="mt-5">
              <label htmlFor="title" className={labelClass}>
                Judul <span className="text-accent">*</span>
              </label>
              <input
                id="title"
                name="title"
                required
                value={title}
                onChange={(event) => handleTitle(event.target.value)}
                placeholder="Judul karya"
                className={`${inputClass} mt-2 font-display text-2xl leading-tight`}
              />
              <FieldError message={state.fieldErrors?.title} />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="slug" className={labelClass}>
                  Slug URL
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(slugify(title));
                    setSlugTouched(true);
                  }}
                  className="text-[9px] uppercase tracking-[0.16em] text-accent hover:underline"
                >
                  Buat dari judul
                </button>
              </div>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugTouched(true);
                }}
                placeholder="judul-karya"
                className={`${inputClass} mt-2 font-mono text-[13px]`}
              />
              <p className="mt-1.5 font-serif text-[11px] text-mute">
                /karya/{slug || slugify(title) || "judul-karya"}
              </p>
              <FieldError message={state.fieldErrors?.slug} />
            </div>

            <div className="mt-5">
              <label htmlFor="excerpt" className={labelClass}>
                Ringkasan <span className="text-accent">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                defaultValue={work?.excerpt ?? ""}
                placeholder="Satu atau dua kalimat yang menggambarkan karya ini…"
                className={`${inputClass} mt-2 resize-y leading-relaxed`}
              />
              <FieldError message={state.fieldErrors?.excerpt} />
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label htmlFor="content" className={labelClass}>
                  Isi karya{" "}
                  {totalFiles === 0 ? (
                    <span className="text-accent">*</span>
                  ) : (
                    <span className="normal-case tracking-normal text-mute">
                      (opsional jika ada berkas)
                    </span>
                  )}
                </label>
                <span className="text-[10px] uppercase tracking-[0.14em] text-mute">
                  {words} kata · {minutes} menit baca
                </span>
              </div>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tulis atau tempel isi karya di sini…"
                className={`${inputClass} mt-2 min-h-[26rem] resize-y leading-[1.9]`}
              />
              <p className="mt-2 font-serif text-[11px] leading-relaxed text-mute">
                Pisahkan paragraf dengan satu baris kosong. Untuk puisi, tulis
                satu baris per baris — pemenggalan baris akan dipertahankan.
                Kosongkan bagian ini jika karya hanya diunggah sebagai berkas.
              </p>
              <FieldError message={state.fieldErrors?.content} />
            </div>
          </section>

          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-mute">
                  <Paperclip
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-accent"
                  />
                  Berkas karya
                </p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  Unggah naskah asli
                </h2>
              </div>
              <span className="text-[9px] uppercase tracking-[0.16em] text-mute">
                {totalFiles}/{MAX_FILES_PER_WORK} berkas
              </span>
            </div>

            <p className="mt-2 font-serif text-xs leading-relaxed text-ink-soft">
              Lampirkan PDF, DOC/DOCX, atau gambar (PNG, JPG, WebP). Maksimal{" "}
              {MAX_UPLOAD_MB} MB per berkas. Isi teks di atas boleh dikosongkan
              jika karya sudah diunggah sebagai berkas.
            </p>

            {existingFiles.length > 0 ? (
              <div className="mt-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-mute">
                  Berkas tersimpan
                </p>
                <ul className="mt-2 divide-y divide-line/70 border-y border-line/70">
                  {existingFiles.map((file) => {
                    const kind = fileKind(file.mime);

                    return (
                      <li
                        key={file.id}
                        className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-paper text-accent">
                          {kind === "image" ? (
                            <ImageIcon
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          ) : (
                            <FileText aria-hidden="true" className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-sm text-ink">
                            {file.name}
                          </p>
                          <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-mute">
                            {file.extension.toUpperCase()} ·{" "}
                            {formatBytes(file.size)}
                          </p>
                        </div>
                        <a
                          href={`/api/berkas/${file.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-accent"
                        >
                          Lihat
                          <ExternalLink
                            aria-hidden="true"
                            className="h-3 w-3"
                          />
                        </a>
                        <label className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] text-mute transition-colors hover:border-accent hover:text-accent">
                          <input
                            type="checkbox"
                            name="removeFile"
                            value={file.id}
                            className="h-3.5 w-3.5 accent-[#8c3a2b]"
                          />
                          Hapus
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 font-serif text-[11px] leading-relaxed text-mute">
                  Centang &ldquo;Hapus&rdquo; lalu simpan untuk menghapus berkas
                  dari arsip.
                </p>
              </div>
            ) : null}

            <label
              htmlFor="files"
              className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-paper px-4 py-6 text-center transition-colors hover:border-accent"
            >
              <Upload aria-hidden="true" className="h-5 w-5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink">
                Pilih berkas
              </span>
              <span className="font-serif text-[11px] text-mute">
                PDF, DOC, DOCX, PNG, JPG, WebP
              </span>
              <input
                id="files"
                name="files"
                type="file"
                multiple
                accept={UPLOAD_ACCEPT}
                onChange={handleFiles}
                className="sr-only"
              />
            </label>

            {fileError ? (
              <p className="mt-2 font-serif text-xs text-accent">{fileError}</p>
            ) : null}
            <FieldError message={state.fieldErrors?.files} />

            {selectedFiles.length > 0 ? (
              <div className="mt-3">
                <p className="text-[9px] uppercase tracking-[0.18em] text-mute">
                  Akan diunggah saat disimpan
                </p>
                <ul className="mt-2 space-y-1.5">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 font-serif text-[11px]"
                    >
                      <span className="truncate text-ink-soft">{file.name}</span>
                      <span className="shrink-0 text-mute">
                        {formatBytes(file.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="border border-line bg-paper-soft p-5">
            <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
              Publikasi
            </p>

            <div className="mt-4">
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={work?.status ?? "published"}
                className={`${inputClass} mt-2`}
              >
                <option value="published">Terbit — tampil di situs</option>
                <option value="draft">Draf — hanya di panel</option>
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="publishedAt" className={labelClass}>
                Tanggal
              </label>
              <input
                id="publishedAt"
                name="publishedAt"
                type="date"
                defaultValue={defaultDate}
                className={`${inputClass} mt-2`}
              />
              <FieldError message={state.fieldErrors?.publishedAt} />
            </div>

            <div className="mt-4">
              <label htmlFor="category" className={labelClass}>
                Kategori
              </label>
              <select
                id="category"
                name="category"
                defaultValue={work?.category ?? categories[0]?.slug ?? ""}
                className={`${inputClass} mt-2`}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldError message={state.fieldErrors?.category} />
            </div>

            <label className="mt-5 flex items-start gap-3 border border-line bg-paper p-3.5">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={work?.featured}
                className="mt-0.5 h-4 w-4 accent-[#8c3a2b]"
              />
              <span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.16em] text-ink">
                  <Sparkles aria-hidden="true" className="h-3 w-3 text-gold" />
                  Karya pilihan
                </span>
                <span className="mt-1 block font-serif text-[11px] leading-snug text-mute">
                  Tampil sebagai karya utama di beranda. Hanya satu karya yang
                  bisa dipilih.
                </span>
              </span>
            </label>
          </section>

          <section className="space-y-2.5 border border-line bg-paper-soft p-5">
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin"
                  />
                  Menyimpan…
                </>
              ) : (
                "Simpan karya"
              )}
            </button>
            <Link
              href="/admin/karya"
              className="flex w-full items-center justify-center gap-2 border border-line px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              Kembali ke daftar
            </Link>
            {work?.status === "published" ? (
              <Link
                href={`/karya/${work.slug}`}
                target="_blank"
                className="flex w-full items-center justify-center gap-2 px-5 py-2 text-[10px] uppercase tracking-[0.16em] text-mute transition-colors hover:text-accent"
              >
                Lihat di situs
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </Link>
            ) : null}
          </section>

          <Notice tone="info" title="Sebelum menyimpan">
            Karya berstatus draf tidak akan muncul di beranda, arsip, maupun
            sitemap. Anda bisa menerbitkannya kapan saja.
          </Notice>
        </aside>
      </div>
    </form>
  );
}
