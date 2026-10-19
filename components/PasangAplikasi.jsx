"use client";

import { useEffect, useState } from "react";

export default function PasangAplikasi() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const simpanPromptInstalasi = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const selesaiInstalasi = () => {
      setInstallPrompt(null);
      setPesan("Aplikasi berhasil ditambahkan ke layar utama.");
    };

    window.addEventListener("beforeinstallprompt", simpanPromptInstalasi);
    window.addEventListener("appinstalled", selesaiInstalasi);

    return () => {
      window.removeEventListener("beforeinstallprompt", simpanPromptInstalasi);
      window.removeEventListener("appinstalled", selesaiInstalasi);
    };
  }, []);

  const pasangAplikasi = async () => {
    if (!installPrompt) {
      const diIPhone = /iphone|ipad|ipod/i.test(navigator.userAgent);
      setPesan(
        diIPhone
          ? "Di iPhone: buka situs ini di Safari, tekan Bagikan, lalu pilih Tambahkan ke Layar Utama."
          : "Jika opsi pasang belum muncul, buka menu browser lalu pilih Instal aplikasi atau Tambahkan ke layar utama."
      );
      return;
    }

    await installPrompt.prompt();
    const pilihan = await installPrompt.userChoice;
    setInstallPrompt(null);
    setPesan(
      pilihan.outcome === "accepted"
        ? "Aplikasi sedang ditambahkan ke layar utama."
        : "Pemasangan dibatalkan. Kamu bisa mencobanya lagi dari menu browser."
    );
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={pasangAplikasi}
        className="shrink-0 rounded-lg border border-utama px-3 py-2 text-sm font-semibold text-utama hover:bg-permukaan sm:px-4"
      >
        Pasang app
      </button>
      {pesan && (
        <p role="status" className="max-w-sm text-xs text-teks-lembut">
          {pesan}
        </p>
      )}
    </div>
  );
}
