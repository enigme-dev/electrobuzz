"use client";

import {
  AcceptBookingSchema,
  BookingReasonSchema,
  BookStatusEnum,
  TAcceptBookingSchema,
  TBookingModel,
  TBookingReasonSchema,
  TGetMerchantBookingPending,
  TGetMerchantBookings,
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
import MerchantBookingDone from "./merchantBookingStatus/merchantBookingDone";
import MerchantBookingExpired from "./merchantBookingStatus/merchantBookingExpired";
import MerchantBookingInProgressAccepted from "./merchantBookingStatus/merchantBookingInProgress";
import MerchantBookingRejected from "./merchantBookingStatus/merchantBookingRejected";
import MerchantBookingInProgress from "./merchantBookingStatus/merchantBookingInProgress";

const MerchantDashboardTransactionDetail = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/merchant/booking/${bookingId}`).then((response) => {
        return response.data.data as any;
      }),
    enabled: !!bookingId,
  });

  console.log(bookingDetailData);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="pb-20 px-8 sm:wrapper max-h-[90vh] overflow-scroll no-scrollbar">
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
