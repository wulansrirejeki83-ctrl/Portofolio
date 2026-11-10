import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
              Arsip Sastra Digital
            </p>
            <p className="mt-5 font-display text-4xl leading-none sm:text-5xl">
              {site.name}
            </p>
            <p className="mt-5 max-w-sm font-serif text-sm leading-relaxed text-paper/55">
              {site.tagline} Tempat puisi, cerpen, esai, dan naskah drama
              disimpan agar tidak hilang oleh waktu.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-7 inline-flex items-center gap-2 border-b border-paper/25 pb-1 text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:border-gold hover:text-gold"
            >
              {site.email}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </a>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-paper/35">
              Jelajahi
            </p>
            <ul className="mt-5 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-lg text-paper/75 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/karya?kategori=puisi"
                  className="font-display text-lg text-paper/75 transition-colors hover:text-gold"
                >
                  Puisi
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-paper/35">
              Terhubung
            </p>
            <ul className="mt-5 divide-y divide-paper/10 border-y border-paper/10">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between py-3.5 text-sm text-paper/70 transition-colors hover:text-gold"
                  >
                    <span>{social.label}</span>
                    <span className="flex items-center gap-2 text-[11px] text-paper/40">
                      {social.handle}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      >
                        <path d="M4 12 12 4M6 4h6v6" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-paper/40">
              {site.location} · Terbuka untuk undangan membaca bersama dan
              lokakarya menulis.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/10 pt-6 text-[10px] uppercase tracking-[0.22em] text-paper/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Seluruh karya dilindungi.</p>
          <p>Dibuat dengan ketenangan &amp; kopi hangat.</p>
        </div>
      </div>
    </footer>
  );
}
