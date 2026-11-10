import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeTone = "success" | "error" | "info";

interface NoticeProps {
  tone?: NoticeTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const tones: Record<
  NoticeTone,
  { wrapper: string; icon: typeof Info; iconClass: string }
> = {
  success: {
    wrapper: "border-sage/25 bg-sage-soft/70 text-sage",
    icon: CheckCircle2,
    iconClass: "text-sage",
  },
  error: {
    wrapper: "border-accent/25 bg-accent/5 text-accent-deep",
    icon: AlertTriangle,
    iconClass: "text-accent",
  },
  info: {
    wrapper: "border-line bg-paper-soft text-ink-soft",
    icon: Info,
    iconClass: "text-mute",
  },
};

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: NoticeProps) {
  const config = tones[tone];
  const Icon = config.icon;

  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn("flex items-start gap-3 border px-4 py-3", config.wrapper, className)}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", config.iconClass)} />
      <div className="font-serif text-sm leading-relaxed">
        {title ? <p className="font-sans text-[10px] uppercase tracking-[0.18em]">{title}</p> : null}
        <div className={cn(title && "mt-1")}>{children}</div>
      </div>
    </div>
  );
}
