import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi user123 untuk undangan membaca bersama, lokakarya menulis, atau sekadar bertukar kabar.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-6 sm:px-8 sm:pt-20">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-mute">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          Kontak
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
          Mari berjumpa
          <br />
          lewat <em className="italic text-accent">kata</em>.
        </h1>
        <p className="mt-6 max-w-xl font-serif text-base leading-[1.85] text-ink-soft">
          Terbuka untuk undangan membaca bersama, lokakarya menulis, diskusi
          sastra di sekolah, atau sekadar bertukar kabar tentang buku yang
          sedang Anda baca.
        </p>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="border-t border-line">
            <a
              href={`mailto:${site.email}`}
              className="group flex items-start justify-between gap-6 border-b border-line py-6"
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.24em] text-mute">
                  Email
                </p>
                <p className="mt-2 font-display text-2xl leading-tight transition-colors group-hover:text-accent">
                  {site.email}
                </p>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mt-1 h-4 w-4 shrink-0 text-mute transition-colors group-hover:text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </a>

            <div className="border-b border-line py-6">
              <p className="text-[9px] uppercase tracking-[0.24em] text-mute">
                Lokasi
              </p>
              <p className="mt-2 font-display text-2xl leading-tight">
                {site.location}
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
                Kunjungan ke taman baca dapat dijadwalkan lebih dahulu melalui
                email.
              </p>
            </div>

            <div className="border-b border-line py-6">
              <p className="text-[9px] uppercase tracking-[0.24em] text-mute">
                Waktu respons
              </p>
              <p className="mt-2 font-display text-2xl leading-tight">
                ± 2–3 hari
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
                Pesan biasanya dibalas setelah jam sekolah, ketika kelas sudah
                sepi.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[9px] uppercase tracking-[0.24em] text-mute">
              Media sosial
            </p>
            <ul className="mt-4 space-y-3">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-baseline justify-between gap-4 font-serif text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    <span>{social.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-mute">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-line bg-paper-soft/70 p-6 sm:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
              <h2 className="font-display text-3xl">Kirim pesan</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-mute">
                Tanpa akun, tanpa formulir panjang
              </p>
            </div>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          <p className="mt-5 font-serif text-xs leading-relaxed text-mute italic">
            Catatan: formulir ini membuka aplikasi email Anda. Untuk keperluan
            resmi, mohon cantumkan nama sekolah atau lembaga pada baris subjek.
          </p>
        </div>
      </div>
    </div>
  );
}
