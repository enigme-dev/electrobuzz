"use client";
import Loader from "@/core/components/loader/loader";
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.isMerchant === "verified") {
      router.push("/merchant/dashboard/profile");
    } else if (session?.user?.isMerchant === "suspended") {
      router.push("/merchant/suspended");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default RegisterAsMerchantLayout;
