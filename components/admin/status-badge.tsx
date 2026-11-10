import type { WorkStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: WorkStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] uppercase tracking-[0.16em]",
        status === "published"
          ? "border-sage/25 bg-sage-soft text-sage"
          : "border-line-strong bg-paper-deep/60 text-mute",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "published" ? "bg-sage" : "bg-mute",
        )}
      />
      {status === "published" ? "Terbit" : "Draf"}
    </span>
  );
}
