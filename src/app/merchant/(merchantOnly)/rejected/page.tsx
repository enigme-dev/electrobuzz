import { Button } from "@/core/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MerchantDashboardRejected = () => {
  return (
    <div className="grid place-items-center place-content-center h-[80vh] gap-5">
      <div className="text-center">
        <h1 className="font-bold sm:text-4xl text-md mb-2">
          Mohon maaf form pendaftaranmu telah ditolak Admin!
        </h1>
        <h2 className="font-semibold sm:text-2xl text-md">
          Mohon daftar kembali dengan data data yang jelas...
        </h2>
      </div>
      <Link href={"/merchant/verifikasi-ulang"}>
        <Button
          variant={"default"}
          className="text-black bg-yellow-400  hover:bg-yellow-300"
        >
          Verifikasi ulang
        </Button>
      </Link>
    </div>
  );
};

export default MerchantDashboardRejected;
