"use client";

import React from "react";
import { Toaster } from "@/core/components/ui/toaster";

const MerchantLayout = ({ children }: any) => {
  return (
    <>
      <div className="h-full w-full">{children}</div>
      <Toaster />
    </>
  );
};

export default MerchantLayout;
