"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  if (!produk) return null;

  // Bersihkan format nomor agar murni angka internasional (tanpa tanda +, spasi, strip, atau angka 0 di depan)
  const nomorMentah = String(toko.nomorWhatsApp || "").replace(/\D/g, "");
  const nomor = nomorMentah.startsWith("0") ? `62${nomorMentah.slice(1)}` : nomorMentah;

  // Hitung total harga
  const totalHarga = (produk.harga || 0) * jumlah;
  const hargaSatuan = formatRupiah(produk.harga).replace(/\s+/g, " ");
  const totalHargaFormat = formatRupiah(totalHarga).replace(/\s+/g, " ");

  // Susun teks pesan otomatis dengan varian dan jumlah
  let detailPesan = `Halo, saya ingin memesan ${produk.nama}`;
  if (varian.trim()) {
    detailPesan += ` (Varian: ${varian.trim()})`;
  }
  if (jumlah > 1) {
    detailPesan += ` sejumlah ${jumlah} pcs (@${hargaSatuan}, Total: ${totalHargaFormat}).`;
  } else {
    detailPesan += ` seharga ${hargaSatuan}.`;
  }

  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(detailPesan)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Jumlah & Varian (US-12) */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-garis bg-permukaan/50 p-3.5">
        {/* Kontrol Jumlah */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-teks-lembut">Jumlah</label>
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((j) => Math.max(1, j - 1))}
              className="px-3 py-1 text-base font-bold text-teks hover:bg-permukaan"
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold">
              {jumlah}
            </span>
            <button
              type="button"
              onClick={() => setJumlah((j) => j + 1)}
              className="px-3 py-1 text-base font-bold text-teks hover:bg-permukaan"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        {/* Input Varian Opsional */}
        <div className="flex flex-1 min-w-[140px] flex-col gap-1">
          <label className="text-xs font-semibold text-teks-lembut">
            Varian / Catatan (opsional)
          </label>
          <input
            type="text"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Contoh: Manis, Ukuran L, dsb."
            className="w-full rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      </div>

      {/* Tombol Pesan WhatsApp */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp {jumlah > 1 && `(${totalHargaFormat})`}
      </a>
    </div>
  );
}

