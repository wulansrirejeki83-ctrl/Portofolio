"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  LoaderCircle,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

import { saveProfileAction } from "@/app/admin/actions";
import { Notice } from "@/components/admin/notice";
import { initialActionState } from "@/lib/action-state";
import { site } from "@/lib/site";
import type {
  AuthorProfile,
  Experience,
  Publication,
} from "@/lib/types";

interface ProfileFormProps {
  profile: AuthorProfile;
}

const inputClass =
  "w-full border border-line bg-paper px-3.5 py-2.5 font-serif text-sm text-ink placeholder:text-mute/60 focus:border-accent focus:outline-none";
const labelClass = "text-[10px] uppercase tracking-[0.2em] text-mute";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-serif text-xs text-accent">{message}</p>;
}

const emptyExperience: Experience = {
  period: "",
  title: "",
  place: "",
  description: "",
};

const emptyPublication: Publication = {
  year: "",
  title: "",
  note: "",
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialActionState,
  );

  const [experience, setExperience] = useState<Experience[]>(
    profile.experience,
  );
  const [publications, setPublications] = useState<Publication[]>(
    profile.publications,
  );

  function updateExperience(
    index: number,
    key: keyof Experience,
    value: string,
  ) {
    setExperience((rows) =>
      rows.map((row, position) =>
        position === index ? { ...row, [key]: value } : row,
      ),
    );
  }

  function updatePublication(
    index: number,
    key: keyof Publication,
    value: string,
  ) {
    setPublications((rows) =>
      rows.map((row, position) =>
        position === index ? { ...row, [key]: value } : row,
      ),
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <input
        type="hidden"
        name="experience"
        value={JSON.stringify(experience)}
      />
      <input
        type="hidden"
        name="publications"
        value={JSON.stringify(publications)}
      />

      {state.status === "error" && state.message ? (
        <Notice tone="error" className="mb-6">
          {state.message}
        </Notice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div className="space-y-6">
          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-mute">
              <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
              Identitas penulis
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_7rem]">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nama <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={profile.name}
                  className={`${inputClass} mt-2`}
                />
                <FieldError message={state.fieldErrors?.name} />
              </div>
              <div>
                <label htmlFor="initials" className={labelClass}>
                  Inisial <span className="text-accent">*</span>
                </label>
                <input
                  id="initials"
                  name="initials"
                  required
                  maxLength={4}
                  defaultValue={profile.initials}
                  className={`${inputClass} mt-2 uppercase`}
                />
                <FieldError message={state.fieldErrors?.initials} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="role" className={labelClass}>
                  Peran <span className="text-accent">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  required
                  defaultValue={profile.role}
                  className={`${inputClass} mt-2`}
                />
                <FieldError message={state.fieldErrors?.role} />
              </div>
              <div>
                <label htmlFor="location" className={labelClass}>
                  Domisili
                </label>
                <input
                  id="location"
                  name="location"
                  defaultValue={profile.location}
                  className={`${inputClass} mt-2`}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="shortBio" className={labelClass}>
                Bio singkat <span className="text-accent">*</span>
              </label>
              <textarea
                id="shortBio"
                name="shortBio"
                required
                rows={3}
                defaultValue={profile.shortBio}
                className={`${inputClass} mt-2 resize-y leading-relaxed`}
              />
              <FieldError message={state.fieldErrors?.shortBio} />
              <p className="mt-1.5 font-serif text-[11px] text-mute">
                Tampil di beranda dan halaman Tentang.
              </p>
            </div>
          </section>

          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
              Bio lengkap &amp; kutipan
            </p>

            <div className="mt-5">
              <label htmlFor="bio" className={labelClass}>
                Paragraf bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={9}
                defaultValue={profile.bio.join("\n\n")}
                className={`${inputClass} mt-2 resize-y leading-[1.8]`}
              />
              <p className="mt-1.5 font-serif text-[11px] text-mute">
                Pisahkan paragraf dengan satu baris kosong.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="quote" className={labelClass}>
                Kutipan
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={3}
                defaultValue={profile.quote}
                className={`${inputClass} mt-2 resize-y leading-relaxed`}
              />
            </div>
          </section>

          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                  Perjalanan
                </p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  Pengalaman
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setExperience((rows) => [...rows, { ...emptyExperience }])
                }
                className="inline-flex items-center gap-1.5 border border-dashed border-line-strong px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-mute transition-colors hover:border-accent hover:text-accent"
              >
                <Plus aria-hidden="true" className="h-3 w-3" />
                Tambah
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {experience.map((item, index) => (
                <div
                  key={index}
                  className="border border-line bg-paper p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-mute">
                      Pengalaman {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExperience((rows) =>
                          rows.filter((_, position) => position !== index),
                        )
                      }
                      aria-label="Hapus pengalaman"
                      className="text-mute transition-colors hover:text-accent"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[10rem_1fr]">
                    <input
                      value={item.period}
                      onChange={(event) =>
                        updateExperience(index, "period", event.target.value)
                      }
                      placeholder="2012 — sekarang"
                      aria-label="Periode"
                      className={inputClass}
                    />
                    <input
                      value={item.title}
                      onChange={(event) =>
                        updateExperience(index, "title", event.target.value)
                      }
                      placeholder="Peran atau judul"
                      aria-label="Peran"
                      className={inputClass}
                    />
                  </div>

                  <div className="mt-3 grid gap-3">
                    <input
                      value={item.place}
                      onChange={(event) =>
                        updateExperience(index, "place", event.target.value)
                      }
                      placeholder="Tempat"
                      aria-label="Tempat"
                      className={inputClass}
                    />
                    <textarea
                      value={item.description}
                      onChange={(event) =>
                        updateExperience(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Deskripsi singkat"
                      aria-label="Deskripsi pengalaman"
                      className={`${inputClass} resize-y leading-relaxed`}
                    />
                  </div>
                </div>
              ))}

              {experience.length === 0 ? (
                <p className="border border-dashed border-line-strong px-4 py-6 text-center font-serif text-sm text-mute">
                  Belum ada pengalaman. Bagian ini boleh dikosongkan.
                </p>
              ) : null}
            </div>
          </section>

          <section className="border border-line bg-paper-soft p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-mute">
                  Jejak terbit
                </p>
                <h2 className="mt-1 font-display text-2xl leading-none">
                  Publikasi
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPublications((rows) => [...rows, { ...emptyPublication }])
                }
                className="inline-flex items-center gap-1.5 border border-dashed border-line-strong px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-mute transition-colors hover:border-accent hover:text-accent"
              >
                <Plus aria-hidden="true" className="h-3 w-3" />
                Tambah
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {publications.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 border border-line bg-paper p-4 sm:grid-cols-[4.5rem_1fr_auto] sm:items-start"
                >
                  <input
                    value={item.year}
                    onChange={(event) =>
                      updatePublication(index, "year", event.target.value)
                    }
                    placeholder="2026"
                    aria-label="Tahun"
                    className={inputClass}
                  />
                  <div className="space-y-2">
                    <input
                      value={item.title}
                      onChange={(event) =>
                        updatePublication(index, "title", event.target.value)
                      }
                      placeholder="Judul publikasi"
                      aria-label="Judul publikasi"
                      className={inputClass}
                    />
                    <input
                      value={item.note}
                      onChange={(event) =>
                        updatePublication(index, "note", event.target.value)
                      }
                      placeholder="Keterangan"
                      aria-label="Keterangan publikasi"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPublications((rows) =>
                        rows.filter((_, position) => position !== index),
                      )
                    }
                    aria-label="Hapus publikasi"
                    className="justify-self-start text-mute transition-colors hover:text-accent sm:mt-2 sm:justify-self-end"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {publications.length === 0 ? (
                <p className="border border-dashed border-line-strong px-4 py-6 text-center font-serif text-sm text-mute">
                  Belum ada publikasi tercatat.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="space-y-2.5 border border-line bg-paper-soft p-5">
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin"
                  />
                  Menyimpan…
                </>
              ) : (
                "Simpan profil"
              )}
            </button>
            <Link
              href="/tentang"
              target="_blank"
              className="flex w-full items-center justify-center gap-2 border border-line px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Lihat halaman Tentang
              <ExternalLink aria-hidden="true" className="h-3 w-3" />
            </Link>
          </section>

          <Notice tone="info" title="Identitas situs">
            Nama di header/footer, email, domain, dan media sosial masih diatur
            di <code className="text-[11px]">lib/site.ts</code> (saat ini{" "}
            {site.email}). Formulir ini mengubah profil penulis di beranda dan
            halaman Tentang.
          </Notice>
        </aside>
      </div>
    </form>
  );
}
