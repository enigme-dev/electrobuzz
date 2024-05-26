import { Button } from "@/core/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MerchantBookingCanceled = () => {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-center">
        <Image
          src="/Feeling sorry-cuate.svg"
          alt="Feeling sorry-cuate"
          className=" w-96 "
          width={900}
          height={500}
        />
      </div>
      <div className="grid place-content-center text-center gap-5">
        <div>
          <h1 className="pt-10 text-2xl font-bold">Maaf...</h1>
          <p className="pt-2">Permintaan anda telah ditolak oleh Mitra</p>
          <h1 className="pt-2 text-left text-md">Alasan:</h1>
          {/* <p className="font-bold">{bookingDetailData}</p> */}
        </div>
        <Link href={"/user/my-bookings"}>
          <Button>Kembali</Button>
        </Link>
      </div>
    </div>
  );
};

export default MerchantBookingCanceled;
