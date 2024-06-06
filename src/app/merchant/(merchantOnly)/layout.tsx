"use client";
import Loader from "@/core/components/loader/loader";
import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const MerchantLayout = ({ children }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.isMerchant === false) {
      router.push("/merchant/register");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <Loader />;
  }
  if (status === "authenticated")
    return (
      <div>
        {children}
        <Toaster />
      </div>
    );
};

export default MerchantLayout;
