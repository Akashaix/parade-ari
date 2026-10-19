"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [cari, setCari] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("Semua");

  // Kumpulkan semua kategori unik
  const daftarKategori = useMemo(() => {
    const set = new Set();
    daftarProduk.forEach((p) => {
      if (p.kategori) set.add(p.kategori);
    });
    return ["Semua", ...Array.from(set)];
  }, [daftarProduk]);

  // Filter berdasarkan pencarian nama dan filter kategori
  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((produk) => {
      const matchKategori =
        kategoriTerpilih === "Semua" || produk.kategori === kategoriTerpilih;
      const matchCari =
        !cari.trim() ||
        produk.nama.toLowerCase().includes(cari.toLowerCase().trim()) ||
        (produk.kategori &&
          produk.kategori.toLowerCase().includes(cari.toLowerCase().trim()));
      return matchKategori && matchCari;
    });
  }, [daftarProduk, kategoriTerpilih, cari]);

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian dan Kategori */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Input Pencarian */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {daftarKategori.map((kat) => {
              const aktif = kategoriTerpilih === kat;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategoriTerpilih(kat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Produk atau Pesan Tidak Ditemukan */}
      {produkTersaring.length === 0 ? (
        <div className="rounded-xl border border-garis bg-permukaan p-8 text-center">
          <p className="font-semibold text-teks">Tidak ada produk yang cocok</p>
          <p className="mt-1 text-sm text-teks-lembut">
            Coba kata kunci lain atau pilih kategori yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

