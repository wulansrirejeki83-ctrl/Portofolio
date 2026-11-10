import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FolderOpen,
  PenLine,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Notice } from "@/components/admin/notice";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatShortDate } from "@/lib/format";
import {
  getAllWorks,
  getAuthorProfile,
  getCategoriesWithCounts,
  getWorkCounts,
} from "@/lib/store";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function AdminDashboardPage() {
  const [counts, works, categories, profile] = await Promise.all([
    getWorkCounts(),
    getAllWorks(),
    getCategoriesWithCounts(),
    getAuthorProfile(),
  ]);

  const recentWorks = works.slice(0, 5);
  const drafts = works.filter((work) => work.status === "draft").slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Ringkasan"
        title="Selamat datang kembali."
        description="Semua yang tampil di halaman publik berasal dari arsip ini. Simpan perubahan, lalu periksa situsnya."
      >
        <Link
          href="/admin/karya/tambah"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Tulis karya
        </Link>
        <Link
          href="/admin/profil"
          className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
          Sunting profil
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total karya"
          value={counts.total}
          hint="Seluruh arsip"
          icon={BookOpen}
        />
        <StatCard
          label="Terbit"
          value={counts.published}
          hint="Tampil di situs"
          icon={Sparkles}
          tone="sage"
        />
        <StatCard
          label="Draf"
          value={counts.draft}
          hint="Belum dipublikasikan"
          icon={PenLine}
          tone="accent"
        />
        <StatCard
          label="Kategori"
          value={counts.categories}
          hint="Ragam karya"
          icon={FolderOpen}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <section className="border border-line bg-paper-soft">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Aktivitas arsip
              </p>
              <h2 className="mt-1 font-display text-2xl leading-none">
                Karya terbaru
              </h2>
            </div>
            <Link
              href="/admin/karya"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-70"
            >
              Lihat semua
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            </Link>
          </div>

          {recentWorks.length > 0 ? (
            <ul className="divide-y divide-line/70">
              {recentWorks.map((work) => (
                <li key={work.id}>
                  <Link
                    href={`/admin/karya/${work.id}/edit`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-deep/30"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-paper font-display text-base text-accent">
                      {work.title.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-lg leading-tight transition-colors group-hover:text-accent">
                        {work.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] uppercase tracking-[0.16em] text-mute">
                        <span>{work.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatShortDate(work.publishedAt)}</span>
                      </span>
                    </span>
                    <StatusBadge status={work.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-2xl">Arsip masih kosong.</p>
              <p className="mx-auto mt-2 max-w-sm font-serif text-sm leading-relaxed text-ink-soft">
                Mulai dengan menulis karya pertama. Setelah diterbitkan, karya
                akan tampil di beranda dan halaman arsip.
              </p>
              <Link
                href="/admin/karya/tambah"
                className="mt-5 inline-flex items-center gap-2 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                Tambah karya
              </Link>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="border border-line bg-paper-soft p-5">
            <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
              Profil penulis
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 font-display text-xl">
                {profile.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-none">
                  {profile.name}
                </p>
                <p className="mt-1 truncate text-[9px] uppercase tracking-[0.16em] text-mute">
                  {profile.role}
                </p>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 font-serif text-sm leading-relaxed text-ink-soft">
              {profile.shortBio}
            </p>
            <Link
              href="/admin/profil"
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-accent hover:underline"
            >
              Sunting profil
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            </Link>
          </section>

          <section className="border border-line bg-paper-soft p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Kategori
              </p>
              <Link
                href="/admin/kategori"
                className="text-[10px] uppercase tracking-[0.14em] text-accent hover:underline"
              >
                Kelola
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-line/70">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="font-display text-base">
                    {category.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    {category.count} karya
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {drafts.length > 0 ? (
            <section className="border border-line bg-paper-soft p-5">
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Menunggu diselesaikan
              </p>
              <ul className="mt-3 space-y-3">
                {drafts.map((work) => (
                  <li key={work.id}>
                    <Link
                      href={`/admin/karya/${work.id}/edit`}
                      className="group flex items-start gap-2.5"
                    >
                      <CalendarDays
                        aria-hidden="true"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-mute"
                      />
                      <span>
                        <span className="block font-serif text-sm leading-snug transition-colors group-hover:text-accent">
                          {work.title}
                        </span>
                        <span className="mt-0.5 block text-[9px] uppercase tracking-[0.16em] text-mute">
                          Draf · {formatShortDate(work.publishedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Notice tone="info" title="Penyimpanan lokal">
            Data admin disimpan di <code className="text-[11px]">.data/store.json</code>{" "}
            pada komputer ini. Supabase belum tersambung, jadi jangan hapus
            folder <code className="text-[11px]">.data</code>.
          </Notice>
        </div>
      </div>
    </div>
  );
}
