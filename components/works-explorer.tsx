"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WorkCard } from "@/components/work-card";
import type { WorkSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryOption {
  slug: string;
  name: string;
  count: number;
}

interface WorksExplorerProps {
  works: WorkSummary[];
  categories: CategoryOption[];
}

type CategoryFilter = string;
type SortOption = "terbaru" | "terlama" | "judul";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "judul", label: "Judul A–Z" },
];

function resolveCategory(
  value: string | null,
  categories: CategoryOption[],
): CategoryFilter {
  if (!value || value === "semua") return "semua";
  return categories.some((category) => category.slug === value)
    ? value
    : "semua";
}

function isSort(value: string | null): value is SortOption {
  return value === "terbaru" || value === "terlama" || value === "judul";
}

export function WorksExplorer({ works, categories }: WorksExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<CategoryFilter>(() =>
    resolveCategory(searchParams.get("kategori"), categories),
  );
  const [sort, setSort] = useState<SortOption>(() => {
    const value = searchParams.get("urut");
    return isSort(value) ? value : "terbaru";
  });

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "semua") params.set("kategori", category);
    if (sort !== "terbaru") params.set("urut", sort);

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }, [query, category, sort, pathname, router]);

  const results = useMemo(() => {
    const keyword = deferredQuery.trim().toLowerCase();

    const filtered = works.filter((work) => {
      const matchesCategory =
        category === "semua" || work.category === category;
      if (!matchesCategory) return false;
      if (!keyword) return true;

      const haystack = [work.title, work.excerpt, work.categoryName]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "judul") return a.title.localeCompare(b.title, "id");
      if (sort === "terlama") return a.publishedAt.localeCompare(b.publishedAt);
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }, [works, deferredQuery, category, sort]);

  const hasFilter = Boolean(query.trim()) || category !== "semua";
  const activeCategoryName = categories.find(
    (item) => item.slug === category,
  )?.name;

  function resetFilters() {
    setQuery("");
    setCategory("semua");
    setSort("terbaru");
  }

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex w-full items-center lg:max-w-sm">
          <span className="sr-only">Cari karya</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="absolute left-0 h-4 w-4 text-mute"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4 4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul atau kata dalam karya…"
            className="w-full border-b border-line bg-transparent py-2.5 pr-8 pl-7 font-serif text-base text-ink placeholder:text-mute/80 focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-0 p-1 text-mute transition-colors hover:text-accent"
              aria-label="Hapus pencarian"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </label>

        <div className="flex items-center gap-3">
          <label
            htmlFor="urut-karya"
            className="text-[10px] uppercase tracking-[0.22em] text-mute"
          >
            Urutkan
          </label>
          <div className="relative">
            <select
              id="urut-karya"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="appearance-none border border-line bg-paper-soft py-2.5 pr-9 pl-3 text-[11px] uppercase tracking-[0.16em] text-ink-soft focus:border-accent focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 text-mute"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2"
        role="group"
        aria-label="Filter kategori"
      >
        <button
          type="button"
          onClick={() => setCategory("semua")}
          aria-pressed={category === "semua"}
          className={cn(
            "border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
            category === "semua"
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink-soft hover:border-accent hover:text-accent",
          )}
        >
          Semua
          <span className="ml-2 text-[9px] opacity-60">{works.length}</span>
        </button>
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setCategory(item.slug)}
            aria-pressed={category === item.slug}
            className={cn(
              "border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
              category === item.slug
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-accent hover:text-accent",
            )}
          >
            {item.name}
            <span className="ml-2 text-[9px] opacity-60">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-mute">
          {results.length} karya
          {category !== "semua" && activeCategoryName && ` · ${activeCategoryName}`}
          {query.trim() && ` · “${query.trim()}”`}
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[10px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
          >
            Atur ulang
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-display text-3xl text-ink">
            Belum ada karya yang cocok.
          </p>
          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-ink-soft">
            Coba kata kunci lain, atau kembalikan filter untuk melihat seluruh
            arsip.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Lihat semua karya
          </button>
        </div>
      )}
    </div>
  );
}
