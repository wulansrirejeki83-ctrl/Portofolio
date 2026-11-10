import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { Notice } from "@/components/admin/notice";
import { demoLoginHint, isDemoLogin } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; keluar?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const demo = isDemoLogin() ? demoLoginHint() : null;

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex xl:p-16">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-paper/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 -bottom-32 h-[28rem] w-[28rem] rounded-full border border-gold/20"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-10 bottom-10 select-none font-display text-[18rem] leading-none text-paper/[0.04]"
        >
          {site.initials}
        </span>

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center border border-paper/25 font-display text-xl">
            {site.initials}
          </span>
          <div>
            <p className="font-display text-xl leading-none">{site.name}</p>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.3em] text-paper/50">
              Arsip Sastra
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span aria-hidden="true" className="font-display text-2xl text-gold">
            ✦
          </span>
          <blockquote className="mt-5 font-display text-4xl leading-[1.25] italic xl:text-5xl">
            “Kata-kata yang disimpan hari ini akan menemukan pembacanya nanti.”
          </blockquote>
          <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-paper/45">
            Panel pengelolaan karya
          </p>
        </div>

        <p className="relative flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-paper/40">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
          Akses terbatas untuk pemilik arsip
        </p>
      </section>

      <section className="flex flex-1 flex-col bg-paper">
        <div className="flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Kembali ke situs
          </Link>
          <span className="text-[9px] uppercase tracking-[0.26em] text-mute">
            Admin
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center border border-ink/25 font-display text-lg">
                {site.initials}
              </span>
              <div>
                <p className="font-display text-lg leading-none">{site.name}</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-mute">
                  Panel Admin
                </p>
              </div>
            </div>

            <p className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-accent lg:mt-0">
              <span aria-hidden="true" className="h-px w-7 bg-accent" />
              Selamat datang kembali
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
              Masuk ke panel.
            </h1>
            <p className="mt-4 font-serif text-sm leading-relaxed text-ink-soft">
              Kelola karya, kategori, dan profil penulis. Semua perubahan
              langsung tampil di halaman publik.
            </p>

            {params.keluar ? (
              <Notice tone="success" className="mt-6">
                Anda sudah keluar dari panel. Sampai jumpa lagi.
              </Notice>
            ) : null}

            <LoginForm next={params.next} />

            {demo ? (
              <div className="mt-7 border border-line bg-paper-soft p-4">
                <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                  Kredensial demo
                </p>
                <dl className="mt-3 space-y-2 font-serif text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-mute">
                      Email
                    </dt>
                    <dd className="font-mono text-[12px] text-ink">
                      {demo.email}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-mute">
                      Sandi
                    </dt>
                    <dd className="font-mono text-[12px] text-ink">
                      {demo.password}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-mute">
                  Login demo lokal. Ganti lewat variabel{" "}
                  <code className="text-[10px]">ADMIN_EMAIL</code> dan{" "}
                  <code className="text-[10px]">ADMIN_PASSWORD</code> sebelum
                  dipakai di server publik.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
