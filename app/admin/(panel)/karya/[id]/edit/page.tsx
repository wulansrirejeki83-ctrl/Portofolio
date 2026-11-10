import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { WorkForm } from "@/components/admin/work-form";
import { getCategories, getWorkById } from "@/lib/store";

export const metadata: Metadata = { title: "Sunting Karya" };

interface EditWorkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const { id } = await params;
  const [work, categories] = await Promise.all([
    getWorkById(id),
    getCategories(),
  ]);

  if (!work) notFound();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Sunting karya"
        title={work.title}
        description="Perubahan akan menggantikan versi yang tampil di situs publik."
      >
        <Link
          href="/admin/karya"
          className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Daftar karya
        </Link>
      </PageHeader>

      <WorkForm work={work} categories={categories} />
    </div>
  );
}
