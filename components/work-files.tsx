import Image from "next/image";
import { Download, ExternalLink, FileText, Paperclip } from "lucide-react";

import { fileKind, formatBytes } from "@/lib/upload-rules";
import type { WorkFile } from "@/lib/types";

interface WorkFilesProps {
  files: WorkFile[];
}

export function WorkFiles({ files }: WorkFilesProps) {
  if (files.length === 0) return null;

  const images = files.filter((file) => fileKind(file.mime) === "image");
  const documents = files.filter((file) => fileKind(file.mime) !== "image");

  return (
    <section
      aria-labelledby="berkas-karya"
      className="mx-auto mt-12 max-w-2xl border border-line bg-paper-soft p-5 sm:mt-16 sm:p-6"
    >
      <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-mute">
        <Paperclip aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
        Berkas karya
      </p>
      <h2
        id="berkas-karya"
        className="mt-2 font-display text-2xl leading-tight sm:text-3xl"
      >
        Baca dalam format asli
      </h2>

      {images.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {images.map((file) => (
            <figure
              key={file.id}
              className="overflow-hidden border border-line bg-paper"
            >
              <a
                href={`/api/berkas/${file.id}`}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden"
              >
                <span className="relative block aspect-[4/3]">
                  <Image
                    src={`/api/berkas/${file.id}`}
                    alt={file.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </span>
              </a>
              <figcaption className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="truncate font-serif text-xs text-ink-soft">
                  {file.name}
                </span>
                <a
                  href={`/api/berkas/${file.id}?unduh=1`}
                  className="inline-flex shrink-0 items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-accent"
                >
                  <Download aria-hidden="true" className="h-3 w-3" />
                  Unduh
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {documents.length > 0 ? (
        <ul className="mt-5 divide-y divide-line/70 border-y border-line/70">
          {documents.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-paper font-display text-[10px] uppercase tracking-[0.06em] text-accent">
                {file.extension.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-sm text-ink">
                  {file.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-mute">
                  <FileText aria-hidden="true" className="h-3 w-3" />
                  {formatBytes(file.size)}
                </p>
              </div>
              <a
                href={`/api/berkas/${file.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                Buka
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>
              <a
                href={`/api/berkas/${file.id}?unduh=1`}
                className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                Unduh
                <Download aria-hidden="true" className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {images.length > 0 ? (
        <p className="mt-4 font-serif text-[11px] leading-relaxed text-mute">
          Klik gambar untuk membukanya dalam ukuran penuh.
        </p>
      ) : null}
    </section>
  );
}
