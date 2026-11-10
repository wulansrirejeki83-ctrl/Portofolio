"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { loginAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialActionState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="border border-accent/30 bg-accent/5 px-4 py-3 font-serif text-sm leading-relaxed text-accent-deep"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="text-[10px] uppercase tracking-[0.2em] text-mute"
        >
          Email
        </label>
        <div className="relative mt-2">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-mute/70"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="username"
            placeholder="admin@example.com"
            className="w-full border border-line bg-paper-soft py-3 pr-3 pl-10 font-serif text-sm text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-[10px] uppercase tracking-[0.2em] text-mute"
        >
          Kata sandi
        </label>
        <div className="relative mt-2">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-mute/70"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full border border-line bg-paper-soft py-3 pr-11 pl-10 font-serif text-sm text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-mute transition-colors hover:text-accent"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
            Memeriksa…
          </>
        ) : (
          "Masuk ke panel"
        )}
      </button>
    </form>
  );
}
