"use client";
import { Button } from "@/core/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const LoginPage = () => {
  return (
    <div className="wrapper px-8 pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-around items-center">
        <div className="grid-cols-1  place-items-center">
          <Image
            src={"/Login-cuate.svg"}
            alt={"login-cuate"}
            className="text-center"
            width={600}
            height={600}
          />
        </div>
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-xl sm:text-2xl text-bold">
            Sign in to ElectroBu⚡z
          </h1>
          <div className="flex justify-center items-center">
            <Button onClick={() => signIn("google")} className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
