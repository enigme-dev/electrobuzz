"use client";

import UserBookingAccept from "@/bookings/component/userBookingStatus/userBookingAccept";
import UserBookingPending from "@/bookings/component/userBookingStatus/userBookingPending";
import UserBookingReject from "@/bookings/component/userBookingStatus/userBookingReject";
import {
  BookStatusEnum,
  TBookingModel,
  TBookingReasonSchema,
  TGetUserBooking,
} from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const BookingDetail = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getLastPathSegment = (pathname: string): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  const bookingId = getLastPathSegment(pathname);

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/user/booking/${bookingId}`).then((response) => {
        return response.data.data as TGetUserBooking;
      }),
    enabled: !!bookingId,
  });

  const { data: bookingDetailDataWithMerchant, isLoading: isLoadingData } =
    useQuery({
      queryKey: ["getBookingDetailData", bookingId],
      queryFn: async () =>
        await axios.get(`/api/user/booking/${bookingId}`).then((response) => {
          return response.data.data as TBookingReasonSchema;
        }),
      enabled: !!bookingId,
    });
  console.log(bookingDetailData);

  // const { mutate: AcceptBookings, isPending: addAddressLoading } =
  //   useMutation({
  //     mutationFn: async (values: TCreateBookingSchema) =>
  //       await axios.post(`/api/merchant/${}/book`, values),
  //     onSuccess: () => {
  //       toast({ title: "Keluhan anda telah terkirim!" });
  //       queryClient.invalidateQueries({
  //         queryKey: ["getBookAppointment", session?.user?.id],
  //       });
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Keluhan anda gagal terkirim!",
  //         variant: "destructive",
  //       });
  //     },
  //   });

  if (isLoading || isLoadingData) {
    return <Loader />;
  }
  return (
    <main className="sm:wrapper pb-20 px-4">
      {bookingDetailData?.bookingStatus == "pending" && (
        <>
          <UserBookingPending bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "rejected" && (
        <>
          <UserBookingReject
            bookingDetailData={{
              bookingReason: bookingDetailDataWithMerchant?.bookingReason
                ? bookingDetailDataWithMerchant.bookingReason
                : "",
            }}
          />
        </>
      )}
      {bookingDetailData?.bookingStatus == "accepted" && (
        <>
          <UserBookingAccept bookingDetailData={bookingDetailData} />
        </>
      )}
    </main>
  );
};

export default BookingDetail;
