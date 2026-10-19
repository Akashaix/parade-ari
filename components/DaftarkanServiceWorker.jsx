"use client";

import { useEffect } from "react";

export default function DaftarkanServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Gagal mendaftarkan service worker PWA.", error);
    });
  }, []);

  return null;
}
