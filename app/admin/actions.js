"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiAdmin();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await buatKoneksiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Password baru dan konfirmasi tidak sama." };
  }

  const supabase = await buatKoneksiAdmin();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi login tidak ditemukan. Silakan login ulang." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: "Gagal mengganti password: " + error.message };
  }

  return { success: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const supabase = await buatKoneksiAdmin();

  // Wajib periksa login di server sesuai Aturan Keamanan no 3
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login tidak valid. Silakan login terlebih dahulu." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: "Gagal menambah produk: " + error.message };
  }

  redirect("/admin");
}

export async function ubahProduk(id, prevState, formData) {
  const supabase = await buatKoneksiAdmin();

  // Wajib periksa login di server sesuai Aturan Keamanan no 3
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login tidak valid. Silakan login terlebih dahulu." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: "Gagal mengubah produk: " + error.message };
  }

  redirect("/admin");
}

export async function hapusProduk(id) {
  const supabase = await buatKoneksiAdmin();

  // Wajib periksa login di server sesuai Aturan Keamanan no 3
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login tidak valid. Silakan login terlebih dahulu." };
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: "Gagal menghapus produk: " + error.message };
  }

  redirect("/admin");
}

export async function buatDeskripsiAI(nama, kategori) {
  const supabase = await buatKoneksiAdmin();

  // Wajib periksa login di server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login tidak valid. Silakan login terlebih dahulu." };
  }

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu untuk membuat deskripsi AI." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error:
        "GEMINI_API_KEY belum disetel di environment variable (.env.local). Silakan tambahkan API key Gemini Anda.",
    };
  }

  try {
    const prompt = `Tuliskan deskripsi produk yang menarik, ringkas, dan persuasif (2-3 kalimat) untuk katalog produk UMKM dengan informasi berikut:
Nama Produk: ${nama}
Kategori: ${kategori || "Umum"}

Gunakan bahasa Indonesia yang ramah dan menarik pembeli. Langsung berikan teks deskripsi saja tanpa tanda kutip atau pembuka.`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { error: data?.error?.message || "Gagal menghubungi Gemini API." };
    }

    const hasil = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!hasil) {
      return { error: "Tidak ada deskripsi yang dihasilkan oleh AI." };
    }

    return { text: hasil };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat memanggil AI." };
  }
}


