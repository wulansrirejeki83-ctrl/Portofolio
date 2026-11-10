import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
          <p className="font-display text-8xl leading-none text-line-strong sm:text-9xl">
            404
          </p>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
            Halaman ini tidak ada
            <br />
            di dalam arsip.
          </h1>
          <p className="mx-auto mt-5 max-w-md font-serif text-base leading-relaxed text-ink-soft">
            Mungkin tautannya sudah berubah, atau karya yang Anda cari belum
            sempat dipublikasikan.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-accent"
            >
              Kembali ke beranda
            </Link>
            <Link
              href="/karya"
              className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Jelajahi karya
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
