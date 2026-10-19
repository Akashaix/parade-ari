"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  error,
  pending = false,
}) {
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");

  const handleBuatDeskripsiAI = async (e) => {
    e.preventDefault();
    setErrorAI("");

    const form = e.currentTarget.closest("form");
    if (!form) return;

    const nama = form.querySelector('input[name="nama"]')?.value?.trim();
    const kategori = form.querySelector('input[name="kategori"]')?.value?.trim();

    if (!nama) {
      setErrorAI("Isi nama produk terlebih dahulu.");
      return;
    }

    setLoadingAI(true);
    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res?.error) {
        setErrorAI(res.error);
      } else if (res?.text) {
        setDeskripsi(res.text);
      }
    } catch (err) {
      setErrorAI(err.message || "Gagal menghasilkan deskripsi AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <Input label="Nama produk" name="nama" defaultValue={produk.nama} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={produk.kategori} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-teks">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={loadingAI}
            className="text-xs font-semibold text-utama hover:underline disabled:opacity-50"
          >
            {loadingAI ? "Sedang membuatkan..." : "✨ Buat dengan AI (Gemini)"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tuliskan deskripsi produk atau gunakan bantuan AI..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {errorAI && <p className="text-xs text-bahaya">{errorAI}</p>}
      </div>

      {error && (
        <p className="rounded-lg bg-permukaan px-3 py-2 text-sm text-bahaya">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Tombol type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}


