"use client";

import FormLoader from "@/core/components/loader/formLoader";
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
    return (
      <div className="wrapper pt-60">
        <FormLoader />
      </div>
    );
  }

  if (!data?.data?.phone && userId) return <div>{children}</div>;
  return router.push("/");
}
