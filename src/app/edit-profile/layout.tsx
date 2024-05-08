"use client";

import { Toast } from "@/core/components/ui/toast";
import { Toaster } from "@/core/components/ui/toaster";
import { CountdownProvider } from "@/users/context/countdownContext";
import React from "react";

const EditProfileLayout = ({ children }: any) => {
  return (
    <div>
      <CountdownProvider>
        {children}
        <Toaster />
      </CountdownProvider>
    </div>
  );
};

export default EditProfileLayout;
