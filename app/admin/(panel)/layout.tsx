import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAuthorProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, profile] = await Promise.all([
    requireAdmin(),
    getAuthorProfile().catch(() => null),
  ]);

  return (
    <AdminShell
      email={session.email}
      authorName={profile?.name}
      authorInitials={profile?.initials}
    >
      {children}
    </AdminShell>
  );
}
