"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("nama") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("pesan") ?? "").trim();

    const subject = encodeURIComponent(`Pesan dari ${name || "pengunjung"} — situs arsip sastra`);
    const body = encodeURIComponent(
      `${message}\n\n—\n${name}\n${email}`,
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nama"
            className="text-[10px] uppercase tracking-[0.22em] text-mute"
          >
            Nama
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama Anda"
            className="mt-2 w-full border-b border-line bg-transparent py-2.5 font-serif text-base text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-[10px] uppercase tracking-[0.22em] text-mute"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nama@email.com"
            className="mt-2 w-full border-b border-line bg-transparent py-2.5 font-serif text-base text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="pesan"
          className="text-[10px] uppercase tracking-[0.22em] text-mute"
        >
          Pesan
        </label>
        <textarea
          id="pesan"
          name="pesan"
          required
          rows={5}
          placeholder="Tuliskan pesan, undangan, atau sapaan Anda…"
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2.5 font-serif text-base leading-relaxed text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-mute">
          Pesan akan dibuka melalui aplikasi email Anda. Tidak ada data yang
          disimpan di situs ini.
        </p>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-ink bg-ink px-6 py-3.5 text-[10px] whitespace-nowrap uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:border-accent hover:bg-accent"
        >
          Kirim pesan
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
        </button>
      </div>

      {sent && (
        <p
          role="status"
          className="border-l-2 border-accent bg-paper-deep/60 px-4 py-3 font-serif text-sm text-ink-soft"
        >
          Aplikasi email Anda seharusnya terbuka. Jika tidak, kirim pesan
          langsung ke{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent underline underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
