import type { Metadata } from "next";
import { Suspense } from "react";
import { WorksExplorer } from "@/components/works-explorer";
import {
  getCategoriesWithCounts,
  getPublishedSummaries,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Jelajahi seluruh arsip puisi, cerpen, esai, artikel, dan naskah drama. Cari berdasarkan judul atau saring berdasarkan kategori.",
};

export default async function KaryaPage() {
  const [categories, workSummaries] = await Promise.all([
    getCategoriesWithCounts(),
    getPublishedSummaries(),
  ]);

  const categoryOptions = categories
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      count: category.count,
    }))
    .filter((category) => category.count > 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
      <header className="relative">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-mute">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          Arsip sastra
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
            Semua karya
          </h1>
          <p className="max-w-sm font-serif text-sm leading-relaxed text-ink-soft">
            {workSummaries.length} karya dalam {categoryOptions.length} kategori.
            Setiap karya disimpan di sini agar bisa dibaca ulang kapan saja.
          </p>
        </div>
      </header>

      <div className="mt-10">
        <Suspense
          fallback={
            <div>
              <div className="h-[73px] border-y border-line" />
              <div className="mt-6 h-10 w-2/3 animate-pulse bg-paper-deep/60" />
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div key={item}>
                    <div className="aspect-[4/5] animate-pulse bg-paper-deep/60" />
                    <div className="mt-5 h-4 w-1/3 animate-pulse bg-paper-deep/60" />
                    <div className="mt-3 h-7 w-3/4 animate-pulse bg-paper-deep/60" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <WorksExplorer works={workSummaries} categories={categoryOptions} />
        </Suspense>
      </div>
    </div>
  );
}
