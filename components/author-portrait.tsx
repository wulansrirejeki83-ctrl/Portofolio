import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface AuthorPortraitProps {
  className?: string;
  caption?: string;
}

/**
 * Potret sementara. Ganti dengan <Image /> ketika foto penulis tersedia.
 */
export function AuthorPortrait({
  className,
  caption = "Potret penulis",
}: AuthorPortraitProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className="absolute -top-4 -left-4 h-full w-full border border-line"
      />
      <div className="relative aspect-[4/5] overflow-hidden bg-[#2a1d16]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 18%, #9c6b4a 0%, #4a3025 45%, #241811 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0px, transparent 46px, rgba(246,232,213,0.16) 47px, transparent 48px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-4 border border-[#f6e8d5]/20 sm:inset-5"
        />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#f6e8d5]/35">
            <span className="font-display text-5xl leading-none text-[#f6e8d5]">
              {site.initials}
            </span>
          </div>
          <p className="mt-7 text-[9px] uppercase tracking-[0.34em] text-[#f6e8d5]/60">
            {caption}
          </p>
          <p className="mt-2 font-display text-xl text-[#f6e8d5]/85">
            {site.name}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="absolute top-6 right-6 font-display text-2xl text-[#f6e8d5]/40"
        >
          ✦
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-6 font-display text-2xl text-[#f6e8d5]/40"
        >
          ✦
        </span>
      </div>
    </div>
  );
}
