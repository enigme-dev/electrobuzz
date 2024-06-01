"use client";

import Loader from "@/core/components/loader/loader";
import MerchantDashboardSideBar from "@/merchants/component/merchantDashboard/merchatDashboardSideBar";
import React, { ReactNode, Suspense } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="md:flex block">
        <div className="sticky top-0 left-0 right-0 h-full grow">
          <MerchantDashboardSideBar />
        </div>
        <main className="w-[calc(100%-280px)]">{children}</main>
      </div>
    </Suspense>
  );
};

export default layout;
