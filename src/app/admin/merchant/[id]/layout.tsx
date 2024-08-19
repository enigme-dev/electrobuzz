"use client";

import { Toaster } from "@/core/components/ui/toaster";

import React from "react";

const Layout = ({ children }: any) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
