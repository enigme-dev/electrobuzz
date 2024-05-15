"use client";
import Loader from "@/core/components/loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const MerchantLayout = ({ children }: any) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant", session?.user?.id],
    queryFn: () => axios.get(`/api/merchant/${session?.user?.id}`),
    enabled: !!session?.user?.id,
  });

  // if (isLoading) {
  //   return <Loader />;
  // }

  // if (isError) {
  //   router.push("/merchant/register");
  // }

  return <div>{children}</div>;
};

export default MerchantLayout;
