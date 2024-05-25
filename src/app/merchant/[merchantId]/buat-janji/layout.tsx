"use client";

import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const BuatJanjiLayout = ({ children }: any) => {
  const { data: session } = useSession();
  const router = useRouter();

  // if (session?.user?.id === undefined) {
  //   router.push("/login");
  // }
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default BuatJanjiLayout;
