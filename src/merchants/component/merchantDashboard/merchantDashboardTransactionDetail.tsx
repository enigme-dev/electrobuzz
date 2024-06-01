"use client";
import React from "react";

import Loader from "@/core/components/loader/loader";

import { useToast } from "@/core/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

import MerchantBookingPending from "../merchantBookingStatus/merchantBookingPending";
import MerchantBookingCanceled from "../merchantBookingStatus/merchantBookingCanceled";
import MerchantBookingAccepted from "../merchantBookingStatus/merchantBookingAccepted";
import MerchantBookingDone from "../merchantBookingStatus/merchantBookingDone";
import MerchantBookingExpired from "../merchantBookingStatus/merchantBookingExpired";
import MerchantBookingRejected from "../merchantBookingStatus/merchantBookingRejected";
import MerchantBookingInProgress from "../merchantBookingStatus/merchantBookingInProgress";
import { usePathname, useSearchParams } from "next/navigation";

const MerchantDashboardTransactionDetail = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const getLastPathSegment = (pathname: string): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };
  const bookingId = getLastPathSegment(pathname);

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/merchant/booking/${bookingId}`).then((response) => {
        return response.data.data as any;
      }),
    enabled: !!bookingId,
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="pb-20 px-8 sm:wrapper ">
      {bookingDetailData?.bookingStatus == "pending" && (
        <MerchantBookingPending bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "canceled" && (
        <MerchantBookingCanceled bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "rejected" && (
        <MerchantBookingRejected bookingDetailData={bookingDetailData} />
      )}
      {(bookingDetailData?.bookingStatus == "accepted" ||
        bookingDetailData?.bookingStatus == "in_progress_requested") && (
        <MerchantBookingAccepted bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "in_progress_accepted" && (
        <MerchantBookingInProgress bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "done" && (
        <MerchantBookingDone bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "expired" && (
        <MerchantBookingExpired bookingDetailData={bookingDetailData} />
      )}
    </main>
  );
};

export default MerchantDashboardTransactionDetail;
