"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";

export default function FormUbahProduk({ produk }) {
  const ubahProdukWithId = ubahProduk.bind(null, produk.id);
  const [state, formAction, pending] = useActionState(ubahProdukWithId, null);

  return (
    <FormProduk
      produk={produk}
      labelTombol="Simpan perubahan"
      action={formAction}
      error={state?.error}
      pending={pending}
    />
  );
}

