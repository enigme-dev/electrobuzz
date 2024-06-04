import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { BillingData } from "../billingHistory/tableComponent/column";
import { usePathname } from "next/navigation";
import { TransactionDoneDataTable } from "./tableComponent/dataTable";
import { Separator } from "@/core/components/ui/separator";
import { Button } from "@/core/components/ui/button";
import Link from "next/link";

export interface BillingDetailData {
  billingId: string;
  billingQty: string;
  billingAmount: number;
  billingCreatedAt: Date;
  billingPaid: boolean;
  payment: [];
}

const BillingPaymentDetail = () => {
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

  return (
    <div className="w-screen lg:w-full px-10 pb-10 ">
      <h1 className="py-10 font-bold text-xl">Detail Tagihan</h1>
      <div className="pb-10">
        <TransactionDoneDataTable />
      </div>
      <ul className="border p-3 shadow-md rounded-lg space-y-2">
        <li className="flex justify-between">
          <p className="text-sm text-gray-400">Total Transaksi selesai:</p>{" "}
          <span>{getBillingsDetailData?.billingQty}</span>
        </li>
        <li className="flex justify-between">
          <p className="text-sm text-gray-400">Fee per transaksi:</p>{" "}
          <span>5000</span>
        </li>
        <Separator />
        <li className="flex justify-between ">
          <h1 className="font-bold">Total</h1>
          <span>{getBillingsDetailData?.billingAmount}</span>
        </li>
        <div className="flex justify-end pt-10">
          <Link href={"/"}>
            <Button>Bayar</Button>
          </Link>
        </div>
      </ul>
    </div>
  );
};

export default BillingPaymentDetail;
