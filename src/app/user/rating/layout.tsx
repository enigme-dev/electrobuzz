"use client";

import Loader from "@/core/components/loader/loader";
import { Toaster } from "@/core/components/ui/toaster";
import React, { ReactNode, Suspense } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Toaster />
        {children}
      </Suspense>
    </div>
  );
};

export default layout;
