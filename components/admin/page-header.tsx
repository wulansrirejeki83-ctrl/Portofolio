import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-accent">
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl font-serif text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      ) : null}
    </header>
  );
}
