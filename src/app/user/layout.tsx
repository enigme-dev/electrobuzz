"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const UserLayout = ({ children }: any) => {
  const { data: session } = useSession();

  if (session?.user?.id === undefined) {
    redirect("/login");
  }

  return <div>{children}</div>;
};

export default UserLayout;
