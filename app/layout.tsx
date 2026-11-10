import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Lora } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});

const serif = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-face",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Arsip Sastra`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "karya sastra",
    "puisi",
    "cerpen",
    "esai",
    "guru bahasa indonesia",
    "arsip sastra",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: `${site.name} — Arsip Sastra`,
    title: `${site.name} — Arsip Sastra`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Arsip Sastra`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f3ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${serif.variable} ${sans.variable}`}
    >
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
