import fs from "node:fs";
import { categories, works, authorProfile } from "../lib/data.ts";

function esc(str) {
  if (str === null || str === undefined) return "''";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

const lines = [];
lines.push("-- SEED DATA UNTUK SUPABASE");
lines.push("-- Jalankan setelah supabase/schema.sql selesai dieksekusi\n");

// 1. Categories
lines.push("-- 1. Seed Categories");
for (const cat of categories) {
  lines.push(
    `insert into public.categories (slug, name, description) values (${esc(cat.slug)}, ${esc(cat.name)}, ${esc(cat.description)}) on conflict (slug) do update set name = excluded.name, description = excluded.description;`
  );
}
lines.push("");

// 2. Works
lines.push("-- 2. Seed Works");
for (const w of works) {
  lines.push(
    `insert into public.works (id, title, slug, category, excerpt, content, published_at, featured, status) values (${esc(w.id)}, ${esc(w.title)}, ${esc(w.slug)}, ${esc(w.category)}, ${esc(w.excerpt)}, ${esc(w.content)}, ${esc(w.publishedAt)}, ${w.featured ? "true" : "false"}, ${esc(w.status)}) on conflict (id) do update set title = excluded.title, slug = excluded.slug, category = excluded.category, excerpt = excluded.excerpt, content = excluded.content, published_at = excluded.published_at, featured = excluded.featured, status = excluded.status;`
  );
}
lines.push("");

// 3. Profile
lines.push("-- 3. Seed Author Profile");
lines.push(
  `insert into public.author_profile (id, name, initials, role, location, short_bio, bio, quote, experience, publications) values (1, ${esc(authorProfile.name)}, ${esc(authorProfile.initials)}, ${esc(authorProfile.role)}, ${esc(authorProfile.location)}, ${esc(authorProfile.shortBio)}, ${esc(JSON.stringify(authorProfile.bio))}::jsonb, ${esc(authorProfile.quote)}, ${esc(JSON.stringify(authorProfile.experience))}::jsonb, ${esc(JSON.stringify(authorProfile.publications))}::jsonb) on conflict (id) do update set name = excluded.name, initials = excluded.initials, role = excluded.role, location = excluded.location, short_bio = excluded.short_bio, bio = excluded.bio, quote = excluded.quote, experience = excluded.experience, publications = excluded.publications;`
);

fs.writeFileSync("supabase/seed.sql", lines.join("\n"), "utf8");
console.log("OK: supabase/seed.sql berhasil dibuat!");
