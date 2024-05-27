"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import MerchantDashboardProfile from "@/merchants/component/merchantDashboardProfile";
import { useSession } from "next-auth/react";
import MerchantDashboardTransaction from "@/merchants/component/merchantDashboardTransaction";
import MerchantDashboardSideBar from "@/merchants/component/merchatDashboardSideBar";
import { NextRequest } from "next/server";
import MerchantDashboardTransactionDetail from "@/merchants/component/merchantDashboardTransactionDetail";

const MerchantDashboard = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const { data: session } = useSession();
  const [view, setView] = useState(<></>);
  console.log(bookingId);
  useEffect(() => {
    if (pathname === "/merchant/dashboard/profile") {
      setView(<MerchantDashboardProfile />);
    } else if (pathname === "/merchant/dashboard/transaction" && bookingId) {
      setView(<MerchantDashboardTransactionDetail />);
    } else if (pathname === "/merchant/dashboard/transaction") {
      setView(<MerchantDashboardTransaction />);
    }
  }, [pathname, bookingId]);

  return (
    <div className="flex w-full">
      <MerchantDashboardSideBar />
      <div className="max-h-screen w-screen">{view}</div>
    </div>
  );
};

export default MerchantDashboard;
