import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "ink" | "accent" | "sage";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  ink: "text-ink",
  accent: "text-accent",
  sage: "text-sage",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "ink",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden border border-line bg-paper-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
          {label}
        </p>
        <Icon aria-hidden="true" className="h-4 w-4 text-mute/70" />
      </div>
      <p
        className={cn(
          "mt-4 font-display text-4xl leading-none",
          toneClasses[tone],
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-mute">
          {hint}
        </p>
      ) : null}
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-px w-12 bg-accent/40"
      />
    </div>
  );
}
