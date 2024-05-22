"use client";

import Loader from "@/core/components/loader/loader";
import FormLoader from "@/core/components/loader/formLoader";
import { Toaster } from "@/core/components/ui/toaster";
import { getData } from "@/core/lib/service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getData(`/api/user/${userId}`),
    enabled: !!userId,
  });

  if (isLoading || status === "loading") {
    return <Loader />;
  }

  if (!data?.data?.phoneVerified && userId)
    return (
      <div>
        {" "}
        {children}
        <Toaster />
      </div>
    );
  return router.push("/");
}
