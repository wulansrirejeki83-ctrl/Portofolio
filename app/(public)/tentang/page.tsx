import type { Metadata } from "next";
import Link from "next/link";
import { AuthorPortrait } from "@/components/author-portrait";
import { site } from "@/lib/site";
import { getAuthorProfile, getPublishedWorks } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getAuthorProfile();

  return {
    title: "Tentang",
    description: `Profil ${profile.name}, ${profile.role.toLowerCase()} yang menulis puisi, cerpen, dan esai tentang ingatan, rumah, dan pendidikan.`,
  };
}

export default async function TentangPage() {
  const [authorProfile, publishedWorks] = await Promise.all([
    getAuthorProfile(),
    getPublishedWorks(),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <AuthorPortrait className="mx-auto max-w-sm lg:max-w-none" />
            <div className="mx-auto mt-8 max-w-sm border border-line bg-paper-soft/60 p-5 lg:max-w-none">
              <p className="text-[9px] uppercase tracking-[0.26em] text-mute">
                Sekilas
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-3">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    Peran
                  </dt>
                  <dd className="text-right font-serif text-ink-soft">
                    Guru &amp; penulis
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-3">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    Domisili
                  </dt>
                  <dd className="text-right font-serif text-ink-soft">
                    {authorProfile.location}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-mute">
                    Karya
                  </dt>
                  <dd className="text-right font-serif text-ink-soft">
                    {publishedWorks.length} karya terarsip
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-mute">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              Tentang penulis
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
              {authorProfile.name}
            </h1>
            <p className="mt-4 font-serif text-lg leading-relaxed text-accent italic">
              {authorProfile.role}
            </p>

            <div className="mt-8 space-y-5">
              {authorProfile.bio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-serif text-base leading-[1.9] text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-accent"
                >
                  {social.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M4 12 12 4M6 4h6v6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-mute">
              Perjalanan
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05]">
              Yang sempat
              <br />
              <em className="italic text-accent">dikerjakan</em>.
            </h2>
            <p className="mt-5 max-w-xs font-serif text-sm leading-relaxed text-ink-soft">
              Bukan daftar pencapaian, melainkan catatan tentang hal-hal yang
              membuatnya terus belajar.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {authorProfile.experience.map((item, index) => (
              <li
                key={item.title}
                className="group grid gap-3 border-t border-line py-7 last:border-b sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-accent">
                    {item.period}
                  </p>
                  <p className="mt-2 font-display text-4xl leading-none text-line-strong">
                    0{index + 1}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-2xl leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-mute">
                    {item.place}
                  </p>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-24 border-y border-line bg-paper-soft/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-mute">
                Publikasi
              </p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05]">
                Karya yang
                <br />
                <em className="italic text-accent">pernah terbit</em>.
              </h2>
            </div>

            <ol className="lg:col-span-8">
              {authorProfile.publications.map((publication) => (
                <li
                  key={publication.title}
                  className="grid gap-2 border-t border-line py-5 last:border-b sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-accent">
                    {publication.year}
                  </span>
                  <span className="font-display text-xl leading-tight">
                    {publication.title}
                  </span>
                  <span className="text-left font-serif text-xs text-mute italic sm:text-right">
                    {publication.note}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-5 text-center sm:px-8">
        <span aria-hidden="true" className="font-display text-2xl text-gold">
          ✦
        </span>
        <blockquote className="mt-5 font-display text-3xl leading-[1.3] italic text-ink sm:text-4xl">
          “{authorProfile.quote}”
        </blockquote>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/karya"
            className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-accent"
          >
            Baca karya
          </Link>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Hubungi penulis
          </Link>
        </div>
      </section>
    </div>
  );
}
