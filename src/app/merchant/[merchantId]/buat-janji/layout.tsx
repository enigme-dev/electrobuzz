"use client";

import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const BuatJanjiLayout = ({ children }: any) => {
  const { data: session } = useSession();

  // if (session?.user?.id === undefined) {
  //   redirect("/login");
  // }

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default BuatJanjiLayout;