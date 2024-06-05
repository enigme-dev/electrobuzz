"use client";
import { Toaster } from "@/core/components/ui/toaster";
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
