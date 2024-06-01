"use client";

import { Toaster } from "@/core/components/ui/toaster";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Toaster />
      {children}
    </div>
  );
};

export default layout;
