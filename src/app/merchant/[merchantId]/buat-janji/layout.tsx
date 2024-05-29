"use client";

import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const BuatJanjiLayout = ({ children }: any) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (!session?.user) {
  //     router.push("/login");
  //   }
  // }, [session, router]);

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default BuatJanjiLayout;
