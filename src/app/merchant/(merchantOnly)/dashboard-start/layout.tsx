"use client";
import Loader from "@/core/components/loader/loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface MerchantAlbums {
  merchantAlbums: [];
}
const Layout = ({ children }: any) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: merchantData, isLoading } = useQuery({
    queryKey: ["getMerchantAlbum"],
    queryFn: async () =>
      await axios.get(`/api/merchant/${session?.user?.id}`).then((response) => {
        return response.data.data as MerchantAlbums;
      }),
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <Loader />;
  }

  if ((merchantData?.merchantAlbums.length ?? 0) > 0) {
    return router.push("/merchant/dashboard/profile");
  }

  return <div>{children}</div>;
};

export default Layout;
