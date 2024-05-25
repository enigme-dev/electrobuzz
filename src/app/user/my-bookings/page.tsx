"use client";

import BookingCard from "@/booking-history/component/bookingCard";
import { BookStatusEnum } from "@/bookings/types";
import Loader from "@/core/components/loader/loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface BookingData {
  merchant: { merchantName: string; merchantPhotoUrl: string };
  bookingSchedule: string;
  bookingStatus: BookStatusEnum;
  bookingId: string;
}

const BookingPage = () => {
  const { data: session } = useSession();
  const {
    isLoading: bookingListLoading,
    error: bookingError,
    data: bookingData,
  } = useQuery({
    queryKey: ["getBookingData", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/user/booking`).then((response) => {
        return response.data.data as BookingData[];
      }),
    enabled: !!session?.user?.id,
  });

  console.log(bookingData);

  if (bookingListLoading) {
    return <Loader />;
  }

  return (
    <main className="wrapper px-4 pt-10 pb-20">
      <h1 className="text-xl sm:text-2xl font-bold pb-10">Booking History</h1>
      <div className=" grid gap-5 max-h-[70vh] overflow-auto no-scrollbar">
        {bookingData !== undefined &&
          bookingData.map((value, index) => (
            <div key={index}>
              <BookingCard
                imgSource={value.merchant.merchantPhotoUrl}
                imgAlt={value.merchant.merchantName}
                orderId={value.bookingId}
                merchName={value.merchant.merchantName}
                time={value.bookingSchedule}
                status={value.bookingStatus}
              />
            </div>
          ))}
      </div>
    </main>
  );
};

export default BookingPage;
