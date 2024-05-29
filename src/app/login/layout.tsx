"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const previousPage = document.referrer;
      if (previousPage) {
        router.push(previousPage);
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  return <div>{children}</div>;
};

export default LoginLayout;
