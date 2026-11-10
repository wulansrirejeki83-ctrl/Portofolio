/**
 * Pembuat slug sederhana yang aman dipakai di server maupun client.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Pastikan slug tidak bentrok. `ignore` dipakai saat mengedit karya
 * supaya slug milik karya itu sendiri tidak dianggap bentrok.
 */
export function uniqueSlug(
  base: string,
  existing: string[],
  ignore?: string,
  fallback = "karya",
): string {
  const root = slugify(base) || fallback;
  const taken = new Set(existing.filter((slug) => slug !== ignore));
  let candidate = root;
  let counter = 2;

  while (taken.has(candidate)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }

  return candidate;
}
