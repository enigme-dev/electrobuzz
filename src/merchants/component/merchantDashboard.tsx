"use client";
import React from "react";
import MerchantDashboardSideBar from "./merchatDashboardSideBar";
import MerchantDashboardProfile from "./merchantDashboardProfile";
import { usePathname } from "next/navigation";
import MerchantDashboardTransaction from "./merchantDashboardTransaction";

const MerchantDashboard = () => {
  const pathname = usePathname();
  return (
    <div className="flex">
      <div className="">
        <MerchantDashboardSideBar />
      </div>
      <div>
        {pathname === "/merchant/dashboard/profile" && (
          <MerchantDashboardProfile />
        )}
        {pathname === "/merchant/dashboard/transaction" && (
          <MerchantDashboardTransaction />
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
