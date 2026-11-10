import Link from "next/link";
import { CoverArt } from "@/components/cover-art";
import { formatDate } from "@/lib/format";
import type { WorkSummary } from "@/lib/types";

interface WorkCardProps {
  work: WorkSummary;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="group">
      <Link href={`/karya/${work.slug}`} className="block">
        <div className="overflow-hidden">
          <CoverArt
            title={work.title}
            category={work.categoryName}
            seed={work.slug}
            className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-mute">
          <span className="text-accent">{work.categoryName}</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          <time dateTime={work.publishedAt}>{formatDate(work.publishedAt)}</time>
        </div>

        <h3 className="mt-3 font-display text-[1.65rem] leading-tight transition-colors duration-300 group-hover:text-accent">
          {work.title}
        </h3>

        <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-ink-soft">
          {work.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent">
            Baca karya
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
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-mute">
            {work.readingMinutes > 0 ? `${work.readingMinutes} menit` : "Berkas"}
          </span>
        </div>
      </Link>
    </article>
  );
}
