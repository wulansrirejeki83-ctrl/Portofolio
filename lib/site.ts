/**
 * Identitas situs.
 * Ganti nilai di bawah ini dengan data penulis yang sebenarnya.
 */
export const site = {
  name: "Wulan Sri Rejeki",
  initials: "W",
  role: "Guru Bahasa Indonesia · Penulis",
  tagline: "Rumah bagi kata-kata yang tinggal.",
  description:
    "Arsip digital puisi, cerpen, esai, dan naskah drama seorang guru Bahasa Indonesia. Sebuah ruang tenang untuk membaca, merenung, dan pulang pada kata-kata.",
  location: "Cimahi, Indonesia",
  url: "https://wulansrirejeki.vercel.app",
  email: "halo@example.com",
  socials: [
    { label: "Instagram", handle: "@wulansrirejeki", href: "https://instagram.com" },
    { label: "Facebook", handle: "wulansrirejeki", href: "https://facebook.com" },
    { label: "LinkedIn", handle: "wulansrirejeki", href: "https://linkedin.com" },
  ],
  nav: [
    { href: "/", label: "Beranda" },
    { href: "/karya", label: "Karya" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" },
  ],
} as const;
