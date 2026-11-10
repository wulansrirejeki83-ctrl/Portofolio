import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt } from "@/components/cover-art";
import { WorkCard } from "@/components/work-card";
import { WorkFiles } from "@/components/work-files";
import { formatDate, readingMinutes } from "@/lib/format";
import { site } from "@/lib/site";
import {
  getAdjacentWorks,
  getCategoryBySlug,
  getRelatedWorks,
  getWorkBySlug,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    return { title: "Karya tidak ditemukan" };
  }

  const category = await getCategoryBySlug(work.category);
  const categoryName = category?.name ?? work.category;
  const url = `/karya/${work.slug}`;

  return {
    title: work.title,
    description: work.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: work.title,
      description: work.excerpt,
      url,
      publishedTime: work.publishedAt,
      authors: [site.name],
      section: categoryName,
      tags: [categoryName, "karya sastra", site.name],
    },
    twitter: {
      card: "summary",
      title: work.title,
      description: work.excerpt,
    },
  };
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const [categoryRecord, adjacent, related] = await Promise.all([
    getCategoryBySlug(work.category),
    getAdjacentWorks(work.slug),
    getRelatedWorks(work.slug),
  ]);

  const category = categoryRecord ?? {
    slug: work.category,
    name: work.category,
    description: "",
  };
  const { newer, older } = adjacent;
  const files = work.files ?? [];
  const hasText = work.content.trim().length > 0;
  const minutes = hasText ? readingMinutes(work.content) : 0;
  const blocks = hasText ? work.content.split(/\n{2,}/) : [];
  const metaLabel = hasText
    ? `${minutes} menit baca`
    : `${files.length} berkas`;
  const isPoetry = work.category === "puisi";
  const isDrama = work.category === "drama";
  const isProse = work.category === "cerpen" || work.category === "esai" || work.category === "artikel";

  return (
    <div className="pb-6">
      <article className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-mute"
        >
          <Link href="/karya" className="transition-colors hover:text-accent">
            Arsip
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/karya?kategori=${work.category}`}
            className="transition-colors hover:text-accent"
          >
            {category.name}
          </Link>
        </nav>

        <header className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-[9px] uppercase tracking-[0.3em] text-accent">
            {category.name}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.04] tracking-[-0.01em] sm:text-6xl">
            {work.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-base leading-relaxed text-ink-soft italic sm:text-lg">
            {work.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] uppercase tracking-[0.2em] text-mute">
            <span>{site.name}</span>
            <span aria-hidden="true" className="text-line-strong">
              ·
            </span>
            <time dateTime={work.publishedAt}>{formatDate(work.publishedAt)}</time>
            <span aria-hidden="true" className="text-line-strong">
              ·
            </span>
            <span>{metaLabel}</span>
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
          <CoverArt
            title={work.title}
            category={category.name}
            seed={work.slug}
            variant="wide"
            className="aspect-[16/11] w-full sm:aspect-[21/9]"
          />
        </div>

        <WorkFiles files={files} />

        <div
          className={cn(
            "mx-auto mt-12 sm:mt-16",
            isProse ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {hasText
            ? blocks.map((block, index) => (
                <p
                  key={index}
                  className={cn(
                    "whitespace-pre-line font-serif text-ink-soft",
                    isPoetry
                      ? "text-[1.1rem] leading-[2.1] sm:text-[1.15rem]"
                      : isDrama
                        ? "text-[1rem] leading-[1.9]"
                        : "text-[1.05rem] leading-[1.95]",
                    index > 0 && (isDrama ? "mt-4" : "mt-7"),
                    isProse && index === 0 && "drop-cap",
                    isDrama &&
                      index === 0 &&
                      "text-center text-[10px] uppercase tracking-[0.3em] text-accent",
                  )}
                >
                  {block}
                </p>
              ))
            : null}

          {hasText ? (
            <div
              aria-hidden="true"
              className="mt-14 flex items-center justify-center gap-3 text-xs text-gold"
            >
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-5 text-[9px] uppercase tracking-[0.2em] text-mute sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/karya"
              className="inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
              Kembali ke arsip
            </Link>
            <span>
              {category.name} · {metaLabel}
            </span>
          </div>
        </div>

        <nav
          aria-label="Navigasi karya"
          className="mx-auto mt-16 grid max-w-5xl border-y border-line sm:grid-cols-2"
        >
          {older ? (
            <Link
              href={`/karya/${older.slug}`}
              className="group border-b border-line p-6 transition-colors hover:bg-paper-soft/70 sm:border-r sm:border-b-0 sm:p-7"
            >
              <span className="text-[9px] uppercase tracking-[0.22em] text-mute">
                ← Karya sebelumnya
              </span>
              <span className="mt-2 block font-display text-2xl leading-tight transition-colors group-hover:text-accent">
                {older.title}
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-mute">
                {older.categoryName}
              </span>
            </Link>
          ) : (
            <div className="hidden items-center border-r border-line p-6 sm:flex sm:p-7">
              <span className="text-[9px] uppercase tracking-[0.2em] text-mute">
                Awal dari arsip
              </span>
            </div>
          )}

          {newer ? (
            <Link
              href={`/karya/${newer.slug}`}
              className="group p-6 text-left transition-colors hover:bg-paper-soft/70 sm:p-7 sm:text-right"
            >
              <span className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Karya berikutnya →
              </span>
              <span className="mt-2 block font-display text-2xl leading-tight transition-colors group-hover:text-accent">
                {newer.title}
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-mute">
                {newer.categoryName}
              </span>
            </Link>
          ) : (
            <div className="hidden items-center justify-end p-6 text-right sm:flex sm:p-7">
              <span className="text-[9px] uppercase tracking-[0.2em] text-mute">
                Ini karya terbaru di arsip
              </span>
            </div>
          )}
        </nav>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-mute">
                Lanjut membaca
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Karya lain dari arsip
              </h2>
            </div>
            <Link
              href="/karya"
              className="text-[10px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
            >
              Semua karya
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <WorkCard key={item.slug} work={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
