import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { BillingData } from "../billingHistory/tableComponent/column";
import { redirect, usePathname, useRouter } from "next/navigation";
import { TransactionDoneDataTable } from "./tableComponent/dataTable";
import { Separator } from "@/core/components/ui/separator";
import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import { IconLeft } from "react-day-picker";
import {
  ArrowBigLeft,
  ArrowLeft,
  ArrowLeftFromLine,
  CreditCard,
  DollarSign,
  FormInput,
  Handshake,
  Receipt,
} from "lucide-react";
import { Card } from "@/core/components/ui/card";
import Loader from "@/core/components/loader/loader";

export interface BillingDetailData {
  billingId: string;
  billingQty: string;
  billingAmount: number;
  billingCreatedAt: Date;
  billingPaid: boolean;
  payment: any[];
}

const BillingPaymentDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const getLastPathSegment = (pathname: string): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };
  const billingId = getLastPathSegment(pathname);

  const {
    isLoading: getBillingsDetailDataLoading,
    error: getBillingsDetailDataError,
    data: getBillingsDetailData,
  } = useQuery({
    queryKey: ["getBillingDetailData", session?.user?.id, billingId],
    queryFn: async () =>
      await axios.get(`/api/merchant/billing/${billingId}`).then((response) => {
        return response.data.data as BillingDetailData;
      }),
    enabled: !!session?.user?.id,
  });

  const getRedirectUrl = async () => {
    await axios
      .post(`/api/merchant/billing/${billingId}`)
      .then((response) => {
        router.push(response.data.data.redirect_url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(getBillingsDetailData);

  const getStatusBilling = getBillingsDetailData?.payment;

  if (getBillingsDetailDataLoading) {
    return <Loader />;
  }

  return (
    <div className="w-screen lg:w-full px-10 pb-20 sm:pb-10 ">
      <div className="flex items-center gap-4">
        <Link href={"/merchant/dashboard/billing"}>
          <ArrowLeft />
        </Link>
        <h1 className="py-10 font-bold text-xl">Detail Tagihan</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-green-100 rounded-lg text-center">
          <Handshake className="text-green-600" />
          <p className="md:text-2xl lg:text-3xl sm:text-lg text-sm py-2  font-extrabold text-green-700">
            {getBillingsDetailData?.billingQty}
          </p>
          <h2 className="text-green-600 text-xs sm:text-sm">Total Transaksi</h2>
        </div>
        <div className="p-5 bg-blue-100 rounded-lg text-center">
          <DollarSign className="text-blue-600" />
          <p className="md:text-2xl lg:text-3xl sm:text-lg text-sm py-2  font-extrabold text-blue-700">
            Rp.{getBillingsDetailData?.billingAmount}
          </p>
          <h2 className="text-blue-600 text-xs sm:text-sm">Total Tagihan</h2>
        </div>
        <div className="p-5 bg-yellow-100 rounded-lg text-center">
          <CreditCard className="text-yellow-600" />
          <p className="md:text-2xl lg:text-3xl sm:text-lg text-sm py-2 font-extrabold text-yellow-700">
            {getStatusBilling ? (
              getStatusBilling.length > 0 ? (
                getStatusBilling?.[0].paymentStatus
              ) : (
                <p>Belum ada transaksi</p>
              )
            ) : (
              <Button
                onClick={() => getRedirectUrl()}
                className="bg-yellow-600 border-yellow-600 w-[200px] hover:bg-yellow-500"
              >
                Bayar
              </Button>
            )}
          </p>
          <h2 className="text-yellow-600 text-xs sm:text-sm">
            Status Pembayaran
          </h2>
        </div>
      </div>
      <div className="pb-10 pt-6">
        <TransactionDoneDataTable />
      </div>
    </div>
  );
};

export default BillingPaymentDetail;
