"use client";

import Loader from "@/core/components/loader/loader";
import MerchantDashboardSideBar from "@/merchants/component/merchantDashboard/merchatDashboardSideBar";
import { TMerchantIdentityModel } from "@/merchants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, Suspense, useEffect } from "react";

export default function MerchantOnlyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: getMerchantIdentities } = useQuery({
    queryKey: ["getMerchantIdentity", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/identity`).then((response) => {
        return response.data.data as TMerchantIdentityModel;
      }),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (getMerchantIdentities?.identityStatus) {
      switch (getMerchantIdentities.identityStatus) {
        case "verified":
          router.push("/merchant/dashboard/profile");
          break;
        case "pending":
          router.push("/merchant/pending");
          break;
        case "suspended":
          router.push("/merchant/suspended");
          break;
        case "rejected":
          router.push("/merchant/rejected");
          break;
        default:
          router.push("/merchant/register");
          break;
      }
    }
  }, [status, router, session]);

  return (
    <Suspense fallback={<Loader />}>
      <div className="lg:flex block">
        <div className="sticky top-0 left-0 right-0 h-full grow">
          <MerchantDashboardSideBar />
        </div>
        <main className="sm:w-[calc(100%-280px)]">{children}</main>
      </div>
    </Suspense>
  );
}
