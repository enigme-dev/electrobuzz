"use client";
import Loader from "@/core/components/loader/loader";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { ReactNode, Suspense } from "react";

const BookingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
};

export default BookingLayout;
