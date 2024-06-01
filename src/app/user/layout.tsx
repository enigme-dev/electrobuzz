"use client";

import Loader from "@/core/components/loader/loader";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const UserLayout = ({ children }: any) => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return <div>{children}</div>;
};

export default UserLayout;
