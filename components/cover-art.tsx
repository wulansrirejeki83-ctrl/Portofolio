import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "card" | "hero" | "wide";

interface CoverArtProps {
  title: string;
  category: string;
  seed: string;
  variant?: Variant;
  className?: string;
}

const palettes = [
  { from: "#7c3024", to: "#3c1711", ink: "#f6e8d5", accent: "#d9a86a" },
  { from: "#3f4b3a", to: "#1b241a", ink: "#efe9da", accent: "#c2a878" },
  { from: "#3b4458", to: "#1a1f2b", ink: "#e9e5dc", accent: "#c9a96a" },
  { from: "#9a6935", to: "#4f3017", ink: "#f8edd9", accent: "#e6c996" },
  { from: "#2f4f4b", to: "#142724", ink: "#e8e3d3", accent: "#c7a874" },
  { from: "#5b2f43", to: "#2b1420", ink: "#f4e7d8", accent: "#d3a39f" },
  { from: "#4a463f", to: "#232019", ink: "#f0e9da", accent: "#c8ab74" },
  { from: "#344a63", to: "#17222f", ink: "#e9e6dc", accent: "#c9a96a" },
  { from: "#6a2834", to: "#331017", ink: "#f6e7d8", accent: "#d8a26b" },
];

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Setiap kategori punya dua nuansa warna yang berdekatan, sehingga arsip
 * terasa satu keluarga tanpa semua sampul tampil sama.
 */
const categoryTone: Record<string, number> = {
  Puisi: 0,
  Cerpen: 2,
  Esai: 4,
  Artikel: 6,
  Drama: 1,
};

export function CoverArt({
  title,
  category,
  seed,
  variant = "card",
  className,
}: CoverArtProps) {
  const baseTone = categoryTone[category] ?? 0;
  const palette =
    palettes[(baseTone + ((hashCode(seed) + 1) % 2)) % palettes.length];
  const initial = title.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{
        backgroundImage: `linear-gradient(155deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 12%, ${palette.accent} 0%, transparent 55%)`,
          opacity: 0.18,
        }}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-4 -bottom-14 select-none font-display leading-none",
          variant === "wide"
            ? "text-[16rem] sm:text-[22rem]"
            : variant === "hero"
              ? "text-[15rem]"
              : "text-[13rem]",
        )}
        style={{ color: palette.ink, opacity: 0.09 }}
      >
        {initial}
      </span>
      <div
        aria-hidden="true"
        className="absolute inset-3 border sm:inset-4"
        style={{ borderColor: `${palette.ink}30` }}
      />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
        <div
          className="flex items-center justify-between gap-4 text-[9px] uppercase tracking-[0.3em]"
          style={{ color: palette.ink }}
        >
          <span>{category}</span>
          <span aria-hidden="true" className="opacity-60">
            ✦
          </span>
        </div>

        <div className="py-6">
          <div
            aria-hidden="true"
            className="mx-auto h-px w-9"
            style={{ backgroundColor: `${palette.ink}80` }}
          />
          <p
            className={cn(
              "mt-4 text-center font-display leading-[1.08]",
              variant === "wide"
                ? "text-3xl sm:text-4xl lg:text-5xl"
                : variant === "hero"
                  ? "text-3xl sm:text-[2.6rem]"
                  : "text-[1.65rem] sm:text-3xl",
            )}
            style={{ color: palette.ink }}
          >
            {title}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-px w-9"
            style={{ backgroundColor: `${palette.ink}80` }}
          />
        </div>

        <p
          className="text-center text-[8px] uppercase tracking-[0.34em]"
          style={{ color: palette.ink, opacity: 0.72 }}
        >
          {site.name}
        </p>
      </div>
    </div>
  );
}
