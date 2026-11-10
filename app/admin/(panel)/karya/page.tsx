import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";

import {
  deleteWorkAction,
  setWorkStatusAction,
} from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Notice } from "@/components/admin/notice";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatShortDate } from "@/lib/format";
import { getAllWorks, getCategories } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Karya" };

interface WorksPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    simpan?: string;
    hapus?: string;
    error?: string;
  }>;
}

type StatusFilter = "semua" | "published" | "draft";

const statusTabs: Array<{ value: StatusFilter; label: string }> = [
  { value: "semua", label: "Semua" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const iconButton =
  "flex h-8 w-8 items-center justify-center border border-line text-mute transition-colors hover:border-accent hover:text-accent";

export default async function AdminWorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status: StatusFilter =
    params.status === "published" || params.status === "draft"
      ? params.status
      : "semua";

  const [allWorks, categories] = await Promise.all([
    getAllWorks(),
    getCategories(),
  ]);

  const categoryNames = new Map(
    categories.map((category) => [category.slug, category.name]),
  );

  const keyword = query.toLowerCase();
  const works = allWorks.filter((work) => {
    if (status !== "semua" && work.status !== status) return false;
    if (!keyword) return true;

    return [work.title, work.excerpt, categoryNames.get(work.category) ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

  const counts: Record<StatusFilter, number> = {
    semua: allWorks.length,
    published: allWorks.filter((work) => work.status === "published").length,
    draft: allWorks.filter((work) => work.status === "draft").length,
  };

  function statusHref(value: StatusFilter): string {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (value !== "semua") search.set("status", value);
    const suffix = search.toString();
    return suffix ? `/admin/karya?${suffix}` : "/admin/karya";
  }

  const hasFilter = Boolean(query) || status !== "semua";

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Arsip karya"
        title="Kelola karya"
        description="Tambah, sunting, terbitkan, atau hapus karya. Perubahan langsung terlihat di halaman publik."
      >
        <Link
          href="/admin/karya/tambah"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Tambah karya
        </Link>
      </PageHeader>

      {params.simpan ? (
        <Notice tone="success">Karya berhasil disimpan.</Notice>
      ) : null}
      {params.hapus ? (
        <Notice tone="success">Karya berhasil dihapus dari arsip.</Notice>
      ) : null}
      {params.status === "terbit" ? (
        <Notice tone="success">Karya berhasil diterbitkan.</Notice>
      ) : null}
      {params.status === "draf" ? (
        <Notice tone="info">Karya dikembalikan menjadi draf.</Notice>
      ) : null}
      {params.error ? (
        <Notice tone="error">{params.error}</Notice>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <form
          action="/admin/karya"
          method="get"
          className="flex w-full max-w-xl items-stretch gap-2"
        >
          {status !== "semua" ? (
            <input type="hidden" name="status" value={status} />
          ) : null}
          <label className="relative flex flex-1 items-center">
            <span className="sr-only">Cari karya</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 h-4 w-4 text-mute"
            />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cari judul atau ringkasan…"
              className="w-full border border-line bg-paper-soft py-2.5 pr-3 pl-9 font-serif text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="border border-line px-4 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            Cari
          </button>
          {hasFilter ? (
            <Link
              href="/admin/karya"
              className="flex items-center border border-line px-4 text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:border-accent hover:text-accent"
            >
              Reset
            </Link>
          ) : null}
        </form>

        <div
          className="flex flex-wrap items-center gap-x-1 gap-y-2"
          role="group"
          aria-label="Filter status"
        >
          {statusTabs.map((tab) => (
            <Link
              key={tab.value}
              href={statusHref(tab.value)}
              aria-current={status === tab.value ? "page" : undefined}
              className={cn(
                "border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors",
                status === tab.value
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-accent hover:text-accent",
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-[9px] opacity-60">
                {counts[tab.value]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {works.length > 0 ? (
        <div className="overflow-x-auto border border-line bg-paper-soft">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-line bg-paper-deep/40">
              <tr className="text-[9px] uppercase tracking-[0.18em] text-mute">
                <th className="px-5 py-3 font-normal">Karya</th>
                <th className="px-4 py-3 font-normal">Kategori</th>
                <th className="px-4 py-3 font-normal">Tanggal</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-5 py-3 text-right font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {works.map((work) => {
                const categoryName =
                  categoryNames.get(work.category) ?? work.category;

                return (
                  <tr
                    key={work.id}
                    className="align-middle transition-colors hover:bg-paper-deep/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-11 w-9 shrink-0 items-center justify-center border border-line bg-paper font-display text-lg text-accent"
                        >
                          {work.title.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/karya/${work.id}/edit`}
                              className="block max-w-xs truncate font-display text-lg leading-tight transition-colors hover:text-accent"
                            >
                              {work.title}
                            </Link>
                            {work.files?.length ? (
                              <span
                                title={`${work.files.length} berkas terlampir`}
                                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-mute"
                              >
                                <Paperclip
                                  aria-hidden="true"
                                  className="h-3 w-3"
                                />
                                {work.files.length}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 max-w-xs truncate font-serif text-[11px] text-mute">
                            {work.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                      {categoryName}
                    </td>
                    <td className="px-4 py-4 text-[11px] text-mute">
                      {formatShortDate(work.publishedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={work.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {work.status === "published" ? (
                          <Link
                            href={`/karya/${work.slug}`}
                            target="_blank"
                            title="Lihat di situs"
                            className={iconButton}
                          >
                            <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                          </Link>
                        ) : null}
                        <Link
                          href={`/admin/karya/${work.id}/edit`}
                          title="Sunting karya"
                          className={iconButton}
                        >
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        </Link>
                        <form action={setWorkStatusAction}>
                          <input type="hidden" name="id" value={work.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={
                              work.status === "published" ? "draft" : "published"
                            }
                          />
                          <button
                            type="submit"
                            title={
                              work.status === "published"
                                ? "Kembalikan ke draf"
                                : "Terbitkan karya"
                            }
                            className={iconButton}
                          >
                            {work.status === "published" ? (
                              <Undo2
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                            ) : (
                              <Send
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                            )}
                          </button>
                        </form>
                        <form action={deleteWorkAction}>
                          <input type="hidden" name="id" value={work.id} />
                          <ConfirmSubmit
                            message={`Hapus "${work.title}" dari arsip? Tindakan ini tidak bisa dibatalkan.`}
                            title="Hapus karya"
                            className={cn(iconButton, "hover:text-accent")}
                          >
                            <Trash2
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-display text-3xl">
            {hasFilter ? "Tidak ada karya yang cocok." : "Arsip masih kosong."}
          </p>
          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-ink-soft">
            {hasFilter
              ? "Coba kata kunci lain atau kembalikan filter untuk melihat seluruh karya."
              : "Mulai dengan menulis karya pertama. Karya berstatus draf tidak akan tampil di situs publik."}
          </p>
          {hasFilter ? (
            <Link
              href="/admin/karya"
              className="mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
            >
              Lihat semua karya
            </Link>
          ) : (
            <Link
              href="/admin/karya/tambah"
              className="mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              Tambah karya
            </Link>
          )}
        </div>
      )}

      <p className="text-[10px] uppercase tracking-[0.18em] text-mute">
        Menampilkan {works.length} dari {allWorks.length} karya
      </p>
    </div>
  );
}
