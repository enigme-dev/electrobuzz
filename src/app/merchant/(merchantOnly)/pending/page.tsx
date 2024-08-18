import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import React from "react";

const MerchantDashboardPending = () => {
  return (
    <div className="grid place-items-center place-content-center h-[80vh] gap-5">
      <div className="text-center">
        <h1 className="font-bold sm:text-4xl text-md">
          Form pendaftaranmu sedang di proses Admin
        </h1>
      </div>
      <Link href={"/"}>
        <Button
          variant={"default"}
          className="text-black bg-yellow-400  hover:bg-yellow-300"
        >
          Kembali ke dashboard
        </Button>
      </Link>
    </div>
  );
};

export default MerchantDashboardPending;
