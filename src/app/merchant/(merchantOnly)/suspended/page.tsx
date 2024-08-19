"use client";

import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import React from "react";

const MerchantDashboardSuspended = () => {
  return (
    <div className="grid place-items-center place-content-center h-[80vh] gap-5">
      <div className="text-center">
        <h1 className="font-bold sm:text-4xl text-md mb-2">
          Mohon maaf akunmu telah disuspend!
        </h1>
        <h2 className="font-semibold sm:text-2xl text-md">
          Mohon hubungi Admin untuk mengetahui alasannya...
        </h2>
      </div>
      <Button
        variant={"default"}
        className="text-black bg-yellow-400 hover:bg-yellow-300"
        onClick={() => window.open("https://wa.me/6282298062565")}
      >
        Hubungi Admin
      </Button>
    </div>
  );
};

export default MerchantDashboardSuspended;
