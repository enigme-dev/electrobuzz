"use client";

import { Toaster } from "@/core/components/ui/toaster";
import RegisterAsMerchant from "@/register-as-merchant/container/registerAsMerchant";
import React from "react";

const RegisterAsMerchantPage = () => {
  return (
    <div className="wrapper px-4 sm:px-0 sm:pt-10 pb-20">
      <RegisterAsMerchant />
      <Toaster />
    </div>
  );
};

export default RegisterAsMerchantPage;
