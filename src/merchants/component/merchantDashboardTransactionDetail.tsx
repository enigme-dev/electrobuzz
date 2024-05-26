"use client";

import {
  AcceptBookingSchema,
  BookingReasonSchema,
  BookStatusEnum,
  TAcceptBookingSchema,
  TBookingModel,
  TBookingReasonSchema,
  TGetMerchantBookingPending,
} from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { useToast } from "@/core/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MerchantBookingPending from "./merchantBookingStatus/merchantBookingPending";
import MerchantBookingCanceled from "./merchantBookingStatus/merchantBookingCanceled";
import MerchantBookingAccepted from "./merchantBookingStatus/merchantBookingAccepted";
import MerchantBookingInProgressRequest from "./merchantBookingStatus/merchantBookingInProgressRequest";
import MerchantBookingDone from "./merchantBookingStatus/merchantBookingDone";
import MerchantBookingExpired from "./merchantBookingStatus/merchantBookingExpired";
import MerchantBookingInProgressAccepted from "./merchantBookingStatus/merchantBookingInProgressAccepted";
import MerchantBookingRejected from "./merchantBookingStatus/merchantBookingRejected";

const MerchantDashboardTransactionDetail = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/merchant/booking/${bookingId}`).then((response) => {
        return response.data.data;
      }),
    enabled: !!bookingId,
  });

  console.log(bookingDetailData);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="pb-20 px-8 max-h-screen no-scrollbar overflow-scroll max-w-screen">
      {bookingDetailData?.bookingStatus == "pending" && (
        <MerchantBookingPending bookingDetailData={bookingDetailData} />
      )}
      {/* {bookingDetailData?.bookingStatus == "canceled" && (
        <MerchantBookingCanceled bookingDetailData={bookingDetailData} />
      )} */}
      {bookingDetailData?.bookingStatus == "rejected" && (
        <MerchantBookingRejected bookingDetailData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "accepted" && (
        <MerchantBookingAccepted bookingDetailData={bookingDetailData} />
      )}
      {/* {bookingDetailData?.bookingStatus == "in_progress_requested" && (
        <MerchantBookingInProgressRequest
          bookingInProgressRequestData={bookingDetailData}
        />
      )}
      {bookingDetailData?.bookingStatus == "in_progress_accepted" && (
        <MerchantBookingInProgressAccepted
          bookingInProgressAcceptedData={bookingDetailData}
        />
      )}
      {bookingDetailData?.bookingStatus == "done" && (
        <MerchantBookingDone bookingDoneData={bookingDetailData} />
      )}
      {bookingDetailData?.bookingStatus == "expired" && (
        <MerchantBookingExpired bookingExpiredData={bookingDetailData} />
      )} */}
    </main>
  );
};

export default MerchantDashboardTransactionDetail;
