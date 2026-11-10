import type { Metadata } from "next";

import { Notice } from "@/components/admin/notice";
import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";
import { getAuthorProfile } from "@/lib/store";

export const metadata: Metadata = { title: "Profil" };

interface ProfilePageProps {
  searchParams: Promise<{ simpan?: string }>;
}

export default async function AdminProfilePage({
  searchParams,
}: ProfilePageProps) {
  const [params, profile] = await Promise.all([
    searchParams,
    getAuthorProfile(),
  ]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Profil penulis"
        title="Kenali dirimu di halaman publik"
        description="Perubahan di sini memengaruhi bio di beranda dan seluruh isi halaman Tentang."
      />

      {params.simpan ? (
        <Notice tone="success">Profil berhasil disimpan.</Notice>
      ) : null}

      <ProfileForm profile={profile} />
    </div>
  );
}
