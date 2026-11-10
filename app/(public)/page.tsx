import Link from "next/link";
import { AuthorPortrait } from "@/components/author-portrait";
import { CoverArt } from "@/components/cover-art";
import { WorkCard } from "@/components/work-card";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import {
  getAuthorProfile,
  getCategoriesWithCounts,
  getFeaturedWork,
  getPublishedSummaries,
  getPublishedWorks,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, publishedWorks, workSummaries, featuredWork, authorProfile] =
    await Promise.all([
      getCategoriesWithCounts(),
      getPublishedWorks(),
      getPublishedSummaries(),
      getFeaturedWork(),
      getAuthorProfile(),
    ]);

  const latestWorks = workSummaries.slice(0, 3);
  const featuredCategory = featuredWork
    ? (categories.find((category) => category.slug === featuredWork.category)
        ?.name ?? featuredWork.category)
    : null;

  return (
    <>
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-0 hidden select-none font-display text-[30rem] leading-[0.7] text-ink/[0.035] lg:block"
        >
          “
        </span>

        <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-mute">
                <span aria-hidden="true" className="h-px w-8 bg-accent" />
                {site.name} — {site.role}
              </p>

              <h1 className="mt-7 font-display text-[3.4rem] leading-[0.94] tracking-[-0.01em] sm:text-7xl lg:text-[5.4rem]">
                Kata yang{" "}
                <em className="relative inline-block italic text-accent">
                  tinggal
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-px w-full bg-accent/40"
                  />
                </em>
                <br />
                setelah senja.
              </h1>

              <p className="mt-8 max-w-lg font-serif text-base leading-[1.85] text-ink-soft sm:text-lg">
                {site.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/karya"
                  className="group inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-accent"
                >
                  Jelajahi karya
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Tentang penulis
                </Link>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  { value: String(publishedWorks.length), label: "Karya terarsip" },
                  { value: String(categories.length), label: "Kategori" },
                  { value: "2012", label: "Mulai mengajar" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-3xl leading-none text-ink">
                      {stat.value}
                    </dd>
                    <dd className="mt-2 text-[9px] uppercase tracking-[0.18em] text-mute">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-5">
              {featuredWork && featuredCategory ? (
                <>
                  <div className="flex items-baseline justify-between gap-4 text-[9px] uppercase tracking-[0.28em] text-mute">
                    <span>Karya pilihan</span>
                    <span className="text-accent">{featuredCategory}</span>
                  </div>

                  <Link
                    href={`/karya/${featuredWork.slug}`}
                    className="group relative mt-4 block"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -inset-3 hidden border border-line lg:block"
                    />
                    <div className="overflow-hidden">
                      <CoverArt
                        title={featuredWork.title}
                        category={featuredCategory}
                        seed={featuredWork.slug}
                        variant="hero"
                        className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
                    <div>
                      <Link
                        href={`/karya/${featuredWork.slug}`}
                        className="font-display text-2xl leading-tight transition-colors hover:text-accent"
                      >
                        {featuredWork.title}
                      </Link>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-mute">
                        {formatDate(featuredWork.publishedAt)}
                      </p>
                    </div>
                    <Link
                      href={`/karya/${featuredWork.slug}`}
                      aria-label={`Baca ${featuredWork.title}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/20 text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="border border-dashed border-line-strong px-8 py-16 text-center">
                  <p className="font-display text-2xl">Belum ada karya terbit.</p>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-ink-soft">
                    Tambahkan karya pertama dari panel admin, lalu karya itu
                    akan muncul di sini.
                  </p>
                  <Link
                    href="/admin"
                    className="mt-6 inline-flex items-center gap-2 border border-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Buka panel admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-mute">
              Kategori
            </p>
            <Link
              href="/karya"
              className="text-[10px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
            >
              Lihat semua karya
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/karya?kategori=${category.slug}`}
                className="group bg-paper p-5 transition-colors duration-300 hover:bg-paper-deep/50 sm:p-6"
              >
                <span className="text-[9px] uppercase tracking-[0.24em] text-mute">
                  0{index + 1}
                </span>
                <span className="mt-3 block font-display text-2xl leading-none transition-colors group-hover:text-accent">
                  {category.name}
                </span>
                <span className="mt-2 block text-[9px] uppercase tracking-[0.18em] text-mute">
                  {category.count} karya
                </span>
              </Link>
            ))}
            <Link
              href="/karya"
              className="group bg-paper-deep/60 p-5 transition-colors duration-300 hover:bg-paper-deep sm:p-6"
            >
              <span aria-hidden="true" className="text-[9px] text-accent">
                ✦
              </span>
              <span className="mt-3 block font-display text-2xl leading-none transition-colors group-hover:text-accent">
                Semua
              </span>
              <span className="mt-2 block text-[9px] uppercase tracking-[0.18em] text-mute">
                {publishedWorks.length} karya
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-mute">
              Dari arsip
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
              Karya terbaru
            </h2>
          </div>
          <Link
            href="/karya"
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent"
          >
            Lihat seluruh arsip
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {latestWorks.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <AuthorPortrait className="mx-auto max-w-sm lg:max-w-none" />
          </div>
          <div className="lg:col-span-7 lg:pl-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-mute">
              Tentang penulis
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl">
              Menulis adalah cara{" "}
              <em className="italic text-accent">mendengarkan</em>.
            </h2>
            <p className="mt-6 font-serif text-base leading-[1.85] text-ink-soft">
              {authorProfile.shortBio}
            </p>
            <p className="mt-4 font-serif text-base leading-[1.85] text-ink-soft">
              {authorProfile.bio[1]}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5 text-[9px] uppercase tracking-[0.2em] text-mute">
              <span>{authorProfile.location}</span>
              <span>{authorProfile.role}</span>
            </div>

            <Link
              href="/tentang"
              className="group mt-8 inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Kenali lebih dekat
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24 border-y border-line bg-paper-deep/60">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <span aria-hidden="true" className="font-display text-2xl text-gold">
            ✦
          </span>
          <blockquote className="mt-6 font-display text-3xl leading-[1.3] italic text-ink sm:text-4xl lg:text-[2.7rem]">
            “{authorProfile.quote}”
          </blockquote>
          <p className="mt-7 text-[9px] uppercase tracking-[0.3em] text-mute">
            — {site.name}
          </p>
          <Link
            href="/karya"
            className="mt-9 inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-accent hover:border-accent"
          >
            Masuk ke arsip
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
