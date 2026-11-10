"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Database,
  ExternalLink,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  email: string;
  children: ReactNode;
}

const navigation = [
  {
    href: "/admin",
    label: "Ringkasan",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/karya", label: "Karya", icon: BookOpen, exact: false },
  {
    href: "/admin/kategori",
    label: "Kategori",
    icon: FolderOpen,
    exact: false,
  },
  { href: "/admin/profil", label: "Profil", icon: UserRound, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link href="/admin" className="group flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center border border-ink/25 font-display text-lg leading-none transition-colors group-hover:border-accent group-hover:text-accent">
        {site.initials}
      </span>
      <span className="flex flex-col">
        <span className="font-display text-lg leading-none">{site.name}</span>
        <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-mute">
          Panel Admin
        </span>
      </span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  email,
  onNavigate,
}: {
  pathname: string;
  email: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="border-b border-line px-5 py-5">
        <Brand />
      </div>

      <nav className="flex-1 px-3 py-5" aria-label="Navigasi panel admin">
        <p className="px-2 pb-3 text-[9px] uppercase tracking-[0.24em] text-mute">
          Kelola arsip
        </p>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:bg-paper-deep/60 hover:text-ink",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4",
                      active ? "text-gold" : "text-mute",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className={cn(
                      "h-3 w-3 transition-opacity",
                      active ? "opacity-70" : "opacity-0 group-hover:opacity-40",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-7 px-2 pb-3 text-[9px] uppercase tracking-[0.24em] text-mute">
          Situs publik
        </p>
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:bg-paper-deep/60 hover:text-ink"
        >
          <ExternalLink aria-hidden="true" className="h-4 w-4 text-mute" />
          Lihat situs
        </Link>
      </nav>

      <div className="border-t border-line px-5 py-5">
        <div className="flex items-start gap-2.5">
          <Database aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 text-gold" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-mute">
              Penyimpanan lokal
            </p>
            <p className="mt-1 font-serif text-[11px] leading-snug text-ink-soft">
              Tersimpan di <code className="text-[10px]">.data/store.json</code>
            </p>
          </div>
        </div>

        <p className="mt-4 truncate text-[10px] text-mute" title={email}>
          {email}
        </p>

        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 border border-line px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
            Keluar
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminShell({ email, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-1 bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-paper-soft lg:flex">
        <SidebarContent pathname={pathname} email={email} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-line bg-paper-soft shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute top-4 right-3 z-10 flex h-8 w-8 items-center justify-center border border-line text-mute transition-colors hover:border-accent hover:text-accent"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
            <SidebarContent
              pathname={pathname}
              email={email}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </button>
            <span className="font-display text-lg leading-none">{site.name}</span>
          </div>

          <p className="hidden text-[10px] uppercase tracking-[0.24em] text-mute lg:block">
            Panel admin — arsip sastra
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-accent"
            >
              Lihat situs
              <ExternalLink aria-hidden="true" className="h-3 w-3" />
            </Link>
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-line sm:block"
            />
            <span className="hidden text-[10px] text-mute sm:block">{email}</span>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
