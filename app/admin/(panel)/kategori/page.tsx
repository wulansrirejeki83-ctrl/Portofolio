import type { Metadata } from "next";
import { Trash2 } from "lucide-react";

import { deleteCategoryAction } from "@/app/admin/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Notice } from "@/components/admin/notice";
import { PageHeader } from "@/components/admin/page-header";
import { getAllWorks, getCategoriesWithCounts } from "@/lib/store";

export const metadata: Metadata = { title: "Kategori" };

interface CategoriesPageProps {
  searchParams: Promise<{
    simpan?: string;
    hapus?: string;
    error?: string;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const [categories, allWorks] = await Promise.all([
    getCategoriesWithCounts(),
    getAllWorks(),
  ]);

  const usage = new Map<string, number>();
  for (const work of allWorks) {
    usage.set(work.category, (usage.get(work.category) ?? 0) + 1);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Taksonomi"
        title="Kelola kategori"
        description="Kategori membantu pembaca menyaring arsip. Kategori yang masih dipakai tidak bisa dihapus."
      />

      {params.simpan ? (
        <Notice tone="success">Kategori baru berhasil ditambahkan.</Notice>
      ) : null}
      {params.hapus ? (
        <Notice tone="success">Kategori berhasil dihapus.</Notice>
      ) : null}
      {params.error ? <Notice tone="error">{params.error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <section className="border border-line bg-paper-soft">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                Daftar kategori
              </p>
              <h2 className="mt-1 font-display text-2xl leading-none">
                {categories.length} kategori
              </h2>
            </div>
          </div>

          {categories.length > 0 ? (
            <ul className="divide-y divide-line/70">
              {categories.map((category, index) => {
                const used = usage.get(category.slug) ?? 0;

                return (
                  <li
                    key={category.slug}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="mt-0.5 w-6 shrink-0 text-[9px] uppercase tracking-[0.16em] text-mute">
                        0{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="font-display text-xl leading-none">
                            {category.name}
                          </p>
                          <code className="text-[10px] text-mute">
                            {category.slug}
                          </code>
                        </div>
                        {category.description ? (
                          <p className="mt-1.5 max-w-xl font-serif text-xs leading-relaxed text-ink-soft">
                            {category.description}
                          </p>
                        ) : null}
                        <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-mute">
                          {used} karya · {category.count} terbit
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-10 sm:pl-0">
                      <form action={deleteCategoryAction}>
                        <input
                          type="hidden"
                          name="slug"
                          value={category.slug}
                        />
                        <ConfirmSubmit
                          message={`Hapus kategori "${category.name}"?`}
                          title={
                            used > 0
                              ? "Kategori masih dipakai karya"
                              : "Hapus kategori"
                          }
                          disabled={used > 0}
                          className="flex h-8 items-center gap-1.5 border border-line px-3 text-[9px] uppercase tracking-[0.14em] text-mute transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-mute"
                        >
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                          Hapus
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-2xl">Belum ada kategori.</p>
              <p className="mt-2 font-serif text-sm text-ink-soft">
                Tambahkan kategori pertama lewat formulir di samping.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="border border-line bg-paper-soft p-5">
            <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
              Kategori baru
            </p>
            <div className="mt-4">
              <CategoryForm />
            </div>
          </section>

          <Notice tone="info" title="Cara kerja">
            Slug dipakai di URL arsip, misalnya{" "}
            <code className="text-[11px]">/karya?kategori=puisi</code>. Kategori
            hanya bisa dihapus setelah tidak ada karya yang memakainya.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
