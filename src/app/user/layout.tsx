"use client";

import Loader from "@/core/components/loader/loader";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const UserLayout = ({ children }: any) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  if (status === "loading") {
    return <Loader />;
  }

  return <div>{children}</div>;
};

export default UserLayout;
