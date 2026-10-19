import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let error = null;

  try {
    const supabase = await buatKoneksiAdmin();
    const { data, error: err } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (err) {
      error = err.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (e) {
    error = e.message || "Gagal mengambil data produk dari database.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-xl border border-garis bg-permukaan p-5 text-sm">
          <p className="font-semibold text-bahaya">Gagal mengambil data produk</p>
          <p className="mt-1 text-teks-lembut">{error}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
