"use client";
import { BillingData } from "@/merchants/component/merchantDashboard/billing/billingHistory/tableComponent/column";
import { BillingHistoryDataTable } from "@/merchants/component/merchantDashboard/billing/billingHistory/tableComponent/dataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const BillingHistory = () => {
  const { data: session } = useSession();
  const {
    isLoading: getBillingsDataLoading,
    error: getMerchantDetailsError,
    data: getBillingsData,
  } = useQuery({
    queryKey: ["getBillingData", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/billing`).then((response) => {
        return response.data.data as BillingData[];
      }),
    enabled: !!session?.user?.id,
  });
  return (
    <div>
      {" "}
      <BillingHistoryDataTable
        data={getBillingsData ? getBillingsData : []}
        isLoading={getBillingsDataLoading}
      />
    </div>
  );
};

export default BillingHistory;
