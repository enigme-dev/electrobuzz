"use client";

import UserBookingAccept from "@/bookings/component/userBookingStatus/userBookingAccept";
import UserBookingCanceled from "@/bookings/component/userBookingStatus/userBookingCanceled";
import UserBookingDone from "@/bookings/component/userBookingStatus/userBookingDone";
import UserBookingExpired from "@/bookings/component/userBookingStatus/userBookingExpired";
import UserBookingInProgress from "@/bookings/component/userBookingStatus/userBookingInProgress";
import UserBookingPending from "@/bookings/component/userBookingStatus/userBookingPending";
import UserBookingReject from "@/bookings/component/userBookingStatus/userBookingReject";

import Loader from "@/core/components/loader/loader";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

import { usePathname } from "next/navigation";
import React from "react";

const BookingDetail = () => {
  const pathname = usePathname();
  const getLastPathSegment = (pathname: string): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  const bookingId = getLastPathSegment(pathname);

  const {
    data: bookingDetailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/user/booking/${bookingId}`).then((response) => {
        return response.data.data as any;
      }),
    enabled: !!bookingId,
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="sm:wrapper px-4 pb-20 lg:pb-0">
      {bookingDetailData?.bookingStatus == "pending" && (
        <>
          <UserBookingPending bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "rejected" && (
        <>
          <UserBookingReject bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "accepted" && (
        <>
          <UserBookingAccept bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "canceled" && (
        <>
          <UserBookingCanceled
            bookingDetailData={{
              ...bookingDetailData,
              bookingReason: bookingDetailData.bookingReason,
            }}
          />
        </>
      )}
      {bookingDetailData?.bookingStatus == "in_progress" && (
        <>
          <UserBookingInProgress bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "done" && (
        <>
          <UserBookingDone bookingDetailData={bookingDetailData} />
        </>
      )}
      {bookingDetailData?.bookingStatus == "expired" && (
        <>
          <UserBookingExpired bookingDetailData={bookingDetailData} />
        </>
      )}
    </main>
  );
};

export default BookingDetail;
