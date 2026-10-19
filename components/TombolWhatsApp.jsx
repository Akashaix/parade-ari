import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  // Bersihkan format nomor agar murni angka internasional (tanpa tanda +, spasi, strip, atau angka 0 di depan)
  const nomorMentah = String(toko.nomorWhatsApp || "").replace(/\D/g, "");
  const nomor = nomorMentah.startsWith("0") ? `62${nomorMentah.slice(1)}` : nomorMentah;

  // Format harga dan pastikan spasi berupa spasi standar ASCII agar encodeURIComponent menghasilkan %20
  const harga = formatRupiah(produk.harga).replace(/\s+/g, " ");
  const pesan = `Halo, saya ingin memesan ${produk.nama} seharga ${harga}.`;
  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
