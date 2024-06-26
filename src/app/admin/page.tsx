"use client";

import MerchantList from "@/users/components/admin/MerchantList";

export default function Page() {
  return (
    <div className="wrapper py-10">
      <h1 className="mb-4 text-2xl font-semibold">Daftar Mitra</h1>
      <MerchantList />
    </div>
  );
}
