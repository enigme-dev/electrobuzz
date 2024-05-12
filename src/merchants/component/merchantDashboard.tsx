import React from "react";
import MerchantDashboardSideBar from "./merchatDashboardSideBar";
import MerchantDashboardProfile from "./merchantDashboardProfile";

const MerchantDashboard = () => {
  return (
    <div className="flex">
      <div className="">
        <MerchantDashboardSideBar />
      </div>
      <div>
        <MerchantDashboardProfile />
      </div>
    </div>
  );
};

export default MerchantDashboard;
