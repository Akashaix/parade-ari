import KatalogProduk from "@/components/KatalogProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let error = null;

  try {
    const supabase = buatKoneksiServer();
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
    error = e.message || "Gagal menghubungi database.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {error ? (
          <div className="rounded-xl border border-garis bg-permukaan p-5 text-sm">
            <p className="font-semibold text-bahaya">Gagal mengambil data produk</p>
            <p className="mt-1 text-teks-lembut">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
        ) : (
          <KatalogProduk daftarProduk={daftarProduk} />
        )}
      </section>
    </>
  );
}
