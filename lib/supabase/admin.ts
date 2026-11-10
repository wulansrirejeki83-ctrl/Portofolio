import "server-only";

import { createClient as createSupabase } from "@supabase/supabase-js";

/**
 * Supabase client dengan Service Role Key.
 * Melewati semua kebijakan RLS — HANYA untuk operasi server-side
 * yang dipanggil setelah autentikasi admin dipastikan.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local",
    );
  }

  return createSupabase(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
