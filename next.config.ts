import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Jangan buat AGENTS.md/CLAUDE.md otomatis setiap `next dev`.
  agentRules: false,
  experimental: {
    serverActions: {
      // Berkas karya diunggah lewat Server Action. Batas per berkas 15 MB,
      // maksimal 8 berkas, dengan ruang lebih untuk overhead multipart.
      bodySizeLimit: "150mb",
    },
  },
};

export default nextConfig;
