import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthorProfile } from "@/lib/store";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile = null;
  try {
    profile = await getAuthorProfile();
  } catch {
    // Abaikan jika database belum siap/koneksi gagal, fallback ke site defaults
  }

  return (
    <>
      <a
        href="#konten"
        className="sr-only z-50 bg-ink px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Lewati ke konten
      </a>
      <SiteHeader name={profile?.name} initials={profile?.initials} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter name={profile?.name} location={profile?.location} />
    </>
  );
}
