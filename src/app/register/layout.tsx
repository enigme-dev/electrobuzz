"use client";

import FormLoader from "@/core/components/loader/formLoader";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { URLSearchParams } from "url";

export const RegisterLayout = ({ children }: any) => {
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
};

export default RegisterLayout;
