"use client";
import Loader from "@/core/components/loader/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.isAdmin === false) {
      router.push("/merchant/register");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <Loader />;
  }
  if (status === "authenticated") return <div>{children}</div>;
};

export default AdminLayout;
