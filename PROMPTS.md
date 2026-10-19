# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## Audit dan pelengkapan US-07 sampai US-14 [SENDIRI]

**Prompt:** Cek US-07 sampai US-14, tandai yang belum tersedia, dan buat fitur yang belum tersedia.

**Hasil:** US-07 sampai US-12 dan tombol dasar US-14 sudah tersedia. US-13 belum mendaftarkan service worker. Endpoint AI masih memakai model Gemini 1.5 Flash. Aksi hapus belum menampilkan error yang dikembalikan server.

**Perbaikan:** Menambahkan service worker PWA dengan cache halaman dan aset publik serta mengecualikan halaman admin; memindahkan pemanggilan AI ke model Gemini 2.5 Flash dengan API key pada header server; menampilkan error aksi hapus; mendokumentasikan konfigurasi key dan pengujian fitur.

## Audit ulang fitur bonus dan PWA [SENDIRI]

**Prompt:** Periksa ulang seluruh US-07 sampai US-14, terutama apakah PWA dapat dipasang dan halaman awal tersedia offline.

**Hasil:** Manifest, ikon 192/512, dan service worker sudah valid di localhost. Audit menemukan halaman awal baru tercache setelah navigasi yang ditangani service worker, dan belum ada metadata standalone khusus iOS.

**Perbaikan:** Cache homepage saat instalasi service worker (best effort), tambahkan metadata Apple Web App, dan lengkapi langkah uji instalasi Android/iOS serta kunjungan pertama offline.

## Memperbaiki manifest dan akses pemasangan PWA [SENDIRI]

**Prompt:** PWA belum terlihat; periksa manifest.js dan pastikan opsi memasang aplikasi tampak.

**Hasil:** Proyek hanya memakai `public/manifest.json` yang ditautkan manual, tanpa rute `app/manifest.js` Next.js. Tidak ada tombol pemasangan di tampilan.

**Perbaikan:** Gunakan metadata manifest dari `app/manifest.js`, sediakan tombol "Pasang app" pada header agar terlihat tanpa scroll, tombol memakai prompt browser bila tersedia dan memberi instruksi Android/iPhone jika tidak, serta sesuaikan service worker dengan URL manifest baru.
