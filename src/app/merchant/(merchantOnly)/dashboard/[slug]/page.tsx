"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MerchantDashboardProfile from "@/merchants/component/merchantDashboardProfile";
import { useSession } from "next-auth/react";
import MerchantDashboardTransaction from "@/merchants/component/merchantDashboardTransaction";
import MerchantDashboardSideBar from "@/merchants/component/merchatDashboardSideBar";

const MerchantDashboard = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [view, setView] = useState(<></>);

  useEffect(() => {
    switch (pathname) {
      case "/merchant/dashboard/profile":
        setView(<MerchantDashboardProfile />);
        break;

      case "/merchant/dashboard/transaction":
        setView(<MerchantDashboardTransaction />);
      default:
        break;
    }
  }, [pathname]);

  return (
    <div className="w-full flex ">
      <MerchantDashboardSideBar />
      <div>{view}</div>
    </div>
  );
};

export default MerchantDashboard;
