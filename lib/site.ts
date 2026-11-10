/**
 * Identitas situs.
 * Ganti nilai di bawah ini dengan data penulis yang sebenarnya.
 */
export const site = {
  name: "user123",
  initials: "U",
  role: "Guru Bahasa Indonesia",
  tagline: "Rumah bagi kata-kata yang tinggal.",
  description:
    "Arsip digital puisi, cerpen, esai, dan naskah drama seorang guru Bahasa Indonesia. Sebuah ruang tenang untuk membaca, merenung, dan pulang pada kata-kata.",
  location: "Yogyakarta, Indonesia",
  url: "https://example.com",
  email: "halo@example.com",
  socials: [
    { label: "Instagram", handle: "@user123", href: "https://instagram.com" },
    { label: "Facebook", handle: "user123", href: "https://facebook.com" },
    { label: "LinkedIn", handle: "user123", href: "https://linkedin.com" },
  ],
  nav: [
    { href: "/", label: "Beranda" },
    { href: "/karya", label: "Karya" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" },
  ],
} as const;
