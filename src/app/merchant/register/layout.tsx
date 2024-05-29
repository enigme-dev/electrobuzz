"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface RegisterAsMerchantLayoutProps {
  children: ReactNode;
}
const RegisterAsMerchantLayout = ({
  children,
}: RegisterAsMerchantLayoutProps) => {
  const { data: session } = useSession();

  if (session?.user?.id === undefined) {
    redirect("/login");
  }

  return <div>{children}</div>;
};

export default RegisterAsMerchantLayout;
