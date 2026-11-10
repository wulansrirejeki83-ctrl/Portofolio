import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { WorkForm } from "@/components/admin/work-form";
import { getCategories } from "@/lib/store";

export const metadata: Metadata = { title: "Tambah Karya" };

export default async function NewWorkPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Karya baru"
        title="Tulis karya"
        description="Isi judul, ringkasan, dan teks karya. Anda bisa menyimpannya sebagai draf terlebih dahulu."
      >
        <Link
          href="/admin/karya"
          className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Daftar karya
        </Link>
      </PageHeader>

      {categories.length > 0 ? (
        <WorkForm categories={categories} />
      ) : (
        <div className="border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-display text-3xl">Belum ada kategori.</p>
          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-ink-soft">
            Tambahkan setidaknya satu kategori sebelum menulis karya.
          </p>
          <Link
            href="/admin/kategori"
            className="mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
          >
            Kelola kategori
          </Link>
        </div>
      )}
    </div>
  );
}
