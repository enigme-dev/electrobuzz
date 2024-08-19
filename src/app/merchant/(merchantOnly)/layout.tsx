"use client";
import Loader from "@/core/components/loader/loader";
import { Toaster } from "@/core/components/ui/toaster";
import { TMerchantIdentityModel } from "@/merchants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const MerchantLayout = ({ children }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    isLoading: getMerchantIdentitiesLoading,
    error: getMerchantIdentitiesError,
    data: getMerchantIdentities,
  } = useQuery({
    queryKey: ["getMerchantIdentity", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/identity`).then((response) => {
        return response.data.data as TMerchantIdentityModel;
      }),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    switch (getMerchantIdentities?.identityStatus) {
      case "verified":
        router.push("/merchant/dashboard/profile");
        break;
      case "pending":
        router.push("/merchant/pending");
        break;
      case "suspended":
        router.push("/merchant/suspended");
        break;
      case "rejected":
        router.push("/merchant/rejected");
        break;
      default:
        router.push("/merchant/register");
        break;
    }
  }, [status, router, session]);

  if (status === "loading" || getMerchantIdentitiesLoading) {
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
