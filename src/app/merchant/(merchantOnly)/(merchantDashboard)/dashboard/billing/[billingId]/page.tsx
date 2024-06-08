"use client";

import { BillingData } from "@/merchants/component/merchantDashboard/billing/billingHistory/tableComponent/column";
import BillingPaymentDetail from "@/merchants/component/merchantDashboard/billing/billingPaymentDetailData/billingPaymentDetail";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const BillingDetailPage = () => {
  return (
    <div>
      <BillingPaymentDetail />
    </div>
  );
};

export default BillingDetailPage;
