"use client";
import Loader from "@/core/components/loader/loader";
import { TMerchantIdentityModel } from "@/merchants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

interface RegisterAsMerchantLayoutProps {
  children: ReactNode;
}
const RegisterAsMerchantLayout = ({
  children,
}: RegisterAsMerchantLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    if (getMerchantIdentities?.identityStatus === "verified") {
      router.push("/merchant/dashboard/profile");
    } else if (getMerchantIdentities?.identityStatus === "suspended") {
      router.push("/merchant/suspended");
    }
  }, [status, router, session]);

  if (status === "loading" || getMerchantIdentitiesLoading) {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default RegisterAsMerchantLayout;
