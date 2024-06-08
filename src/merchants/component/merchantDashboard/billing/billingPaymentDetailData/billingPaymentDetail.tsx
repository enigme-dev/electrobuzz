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
import CustomBadge from "@/core/components/CustomBadge";

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
        console.error(error);
      });
  };

  const getStatusBilling = getBillingsDetailData?.payment;

  if (getBillingsDetailDataLoading) {
    return (
      <div className="w-screen lg:w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-screen lg:w-full px-4 sm:px-10 pb-20 sm:pb-10">
      <div className="flex items-center gap-4">
        <Link href={"/merchant/dashboard/billing"}>
          <ArrowLeft />
        </Link>
        <h1 className="py-10 font-bold text-xl">Detail Tagihan</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <div className="w-full lg:w-[55vw] ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-green-100 rounded-lg text-center">
              <Handshake className="text-green-600" />
              <p className="md:text-2xl lg:text-3xl text-lg py-2 font-extrabold text-green-700">
                {getBillingsDetailData?.billingQty}
              </p>
              <h2 className="text-green-600 text-xs sm:text-sm">
                Total Transaksi
              </h2>
            </div>
            <div className="p-5 bg-blue-100 rounded-lg text-center">
              <DollarSign className="text-blue-600" />
              <p className="md:text-2xl lg:text-3xl text-lg py-2 font-extrabold text-blue-700">
                Rp.5000
              </p>
              <h2 className="text-blue-600 text-sm sm:text-base">
                Fee Per Transaksi
              </h2>
            </div>
          </div>
          <div className="pb-10 pt-6">
            <TransactionDoneDataTable
              billingCreatedAt={getBillingsDetailData?.billingCreatedAt}
            />
          </div>
        </div>
        <div className="p-5 bg-yellow-100 rounded-lg text-center w-full sm:w-[25vw] h-fit lg:w-[30vw]">
          <div className="flex items-center gap-4">
            <CreditCard className="text-yellow-600" />
            <h1 className="text-yellow-600 text-sm sm:text-lg font-bold">
              Pembayaran
            </h1>
          </div>
          <div className="">
            <h2 className="text-yellow-600 text-xs sm:text-sm font-bold text-start pt-5">
              Status Pembayaran
            </h2>
            <div className="pt-3">
              {getBillingsDetailData ? (
                getBillingsDetailData.billingPaid ? (
                  <CustomBadge status="success" title="Sudah Bayar" />
                ) : (
                  <CustomBadge status="failed" title="Belum Bayar" />
                )
              ) : (
                <p className="text-gray-400 italic">Belum ada transaksi</p>
              )}
            </div>
          </div>
          <ul className="grid gap-2 py-5">
            <h2 className="text-yellow-600 text-xs sm:text-sm font-bold text-start py-2">
              Total Tagihan
            </h2>
            <li className="flex items-center justify-between">
              <p className="text-xs text-yellow-600">Total Transaksi</p>
              <p className="text-xs text-yellow-600">
                {getBillingsDetailData?.billingQty}
              </p>
            </li>
            <li className="flex items-center justify-between">
              <p className="text-xs text-yellow-600">Fee Per Transaksi</p>
              <p className="text-xs text-yellow-600">Rp.5000</p>
            </li>
            <Separator className="bg-yellow-600" />
            <li className="flex items-center justify-between">
              <p className="text-xs text-yellow-600">Total Tagihan</p>
              <p className="text-xs text-yellow-600">
                Rp.{getBillingsDetailData?.billingAmount}
              </p>
            </li>
          </ul>
          <p className="md:text-2xl lg:text-3xl sm:text-lg text-sm py-2 font-extrabold text-yellow-700">
            {getBillingsDetailData?.billingPaid ? (
              getStatusBilling && getStatusBilling.length > 0 ? (
                <a
                  href={getStatusBilling[0].paymentStatus}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Payment Link
                </a>
              ) : (
                <Button
                  onClick={() => getRedirectUrl()}
                  className="bg-yellow-600 border-yellow-600 w-[200px] hover:bg-yellow-500"
                >
                  Bayar
                </Button>
              )
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingPaymentDetail;
