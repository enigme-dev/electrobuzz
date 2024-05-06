import { Button } from "@/core/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BookingDetailPage = () => {
  return (
    <div className="wrapper py-10">
      <div className="flex items-center justify-center">
        <Image
          src="/Payment information-cuate.svg"
          alt="Feeling sorry-cuate"
          className="w-96"
          width={500}
          height={500}
        />
      </div>
      <div className="grid place-content-center text-center gap-5">
        <div>
          <h1 className="pt-10 text-2xl font-bold">
            Tolong deposit terlebih dahulu
          </h1>
          <p className="pt-2">Anda harus membayar deposit sebesar:</p>
          <p className="font-bold pt-2">Rp.100.000</p>
          <p className="pt-2 text-sm text-left text-red-500">
            - Supaya pembuatan jadwal bisa berlangsung dengan lancar
            <br />- Uang deposit akan dikembalikan setelah transaksi selesai
          </p>
        </div>
        <Link href={"/bookings"}>
          <Button>Bayar</Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingDetailPage;
