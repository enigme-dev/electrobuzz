"use client";

import Loader from "@/core/components/loader/loader";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");

  const getMerchantPaymentBillingStatus = () => {
    axios
      .get(`/api/merchant/billing/payment/${orderId}`)
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
        console.error(error);
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
