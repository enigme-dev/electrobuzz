"use client";

import { Toaster } from "@/core/components/ui/toaster";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const ProfileLayout = ({ children }: any) => {
  return (
    <div>
      <Toaster />
      {children}
    </div>
  );
};

export default ProfileLayout;
