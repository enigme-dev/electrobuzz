"use client";

import FormLoader from "@/core/components/loader/formLoader";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const router = useRouter();

  if (status === "loading" && pathname == "/register") {
    return (
      <div className="wrapper pt-60">
        <FormLoader />
      </div>
    );
  }

  if (session?.user?.isNewUser) return <div>{children}</div>;
  return router.push("/");
}
