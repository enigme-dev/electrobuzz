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

    switch (session?.user?.isMerchant) {
      case "unregistered":
        router.push("/merchant/register");
        break;
      case "verified":
        router.push("/merchant/dashboard/profile");
        break;
      case "rejected":
        router.push("/merchant/rejected");
        break;
      case "pending":
        router.push("/merchant/pending");
        break;
      case "suspended":
        router.push("/merchant/suspended");
        break;
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
