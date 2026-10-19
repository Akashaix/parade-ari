import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormUbahProduk from "./FormUbahProduk";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = await buatKoneksiAdmin();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;
    }
  } catch {
    // Error ditangani dengan notFound()
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} />
    </div>
  );
}
