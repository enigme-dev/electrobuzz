"use client";

import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";

const BuatJanjiLayout = ({ children }: any) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session?.user?.id) {
    redirect(`/login?redirect=${pathname}`);
  }

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default BuatJanjiLayout;
