"use client";

import { useActionState } from "react";
import { LoaderCircle, Plus } from "lucide-react";

import { saveCategoryAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";

const inputClass =
  "w-full border border-line bg-paper px-3.5 py-2.5 font-serif text-sm text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none";
const labelClass = "text-[10px] uppercase tracking-[0.2em] text-mute";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(
    saveCategoryAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="border border-accent/25 bg-accent/5 px-3.5 py-2.5 font-serif text-xs leading-relaxed text-accent-deep"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="category-name" className={labelClass}>
          Nama kategori <span className="text-accent">*</span>
        </label>
        <input
          id="category-name"
          name="name"
          required
          placeholder="Misalnya: Pantun"
          className={`${inputClass} mt-2`}
        />
        {state.fieldErrors?.name ? (
          <p className="mt-1.5 font-serif text-xs text-accent">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="category-slug" className={labelClass}>
          Slug
        </label>
        <input
          id="category-slug"
          name="slug"
          placeholder="otomatis dari nama"
          className={`${inputClass} mt-2 font-mono text-[13px]`}
        />
      </div>

      <div>
        <label htmlFor="category-description" className={labelClass}>
          Deskripsi
        </label>
        <textarea
          id="category-description"
          name="description"
          rows={3}
          placeholder="Satu kalimat tentang kategori ini…"
          className={`${inputClass} mt-2 resize-y leading-relaxed`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
            Menyimpan…
          </>
        ) : (
          <>
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Tambah kategori
          </>
        )}
      </button>
    </form>
  );
}
