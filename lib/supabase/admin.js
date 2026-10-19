import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Koneksi Supabase untuk sesi admin (login, logout, ganti password, kelola produk).
 * Memakai SUPABASE_PUBLISHABLE_KEY + cookie agar RLS tetap berlaku.
 * Hanya boleh dipanggil di Server Component, Server Action, atau Route Handler.
 */
export async function buatKoneksiAdmin() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dari Server Component, setAll bisa gagal karena header sudah terkirim.
            // Ini aman diabaikan jika cookie disetel ulang di middleware/proxy.
          }
        },
      },
    }
  );
}

