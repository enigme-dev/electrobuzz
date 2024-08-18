"use client";

import Loader from "@/core/components/loader/loader";
import { Logger } from "@/core/lib/logger";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");

  const getMerchantPaymentBillingStatus = () => {
    axios
      .get(`api/merchant/billing/payment/${orderId}`)
      .then((response) => {
        const billingId = response.data.data.billingId;
        const paymentStatus = response.data.data.paymentStatus;
        if (paymentStatus === "success") {
          router.push(`/merchant/billing/${billingId}?status=success`);
        } else if (paymentStatus === "failed") {
          router.push(`/merchant/billing/${billingId}?status=failed`);
        }
      })
      .catch((error) => {
        Logger.debug(error);
      });
  };

  useEffect(() => {
    getMerchantPaymentBillingStatus();
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default PaymentPage;
