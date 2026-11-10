"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${site.name} — Beranda`}
        >
          <span className="flex h-11 w-11 items-center justify-center border border-ink/25 font-display text-xl leading-none transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
            {site.initials}
          </span>
          <span className="flex flex-col">
            <span className="font-display text-xl leading-none tracking-wide">
              {site.name}
            </span>
            <span className="mt-1.5 text-[9px] uppercase tracking-[0.32em] text-mute">
              Arsip Sastra
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {site.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300",
                  active
                    ? "text-accent"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/karya"
          className="hidden items-center gap-2 border border-ink/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent lg:flex"
        >
          Baca Karya
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

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-ink/20 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          <span
            className={cn(
              "h-px w-5 bg-ink transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-ink transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div
        id="menu-mobile"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "overflow-hidden border-line bg-paper transition-[max-height,opacity] duration-500 ease-out md:hidden",
          open ? "max-h-[28rem] border-t opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col px-5 py-4 sm:px-8"
          aria-label="Navigasi seluler"
        >
          {site.nav.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-baseline justify-between border-b border-line/70 py-4",
                isActive(pathname, item.href) ? "text-accent" : "text-ink",
              )}
            >
              <span className="font-display text-2xl">{item.label}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-mute">
                0{index + 1}
              </span>
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="mt-4 text-[11px] uppercase tracking-[0.2em] text-mute"
          >
            {site.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
