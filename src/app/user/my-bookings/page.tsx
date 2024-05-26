"use client";

import BookingCard from "@/booking-history/component/bookingCard";
import { BookStatusEnum, TGetUserBooking } from "@/bookings/types";
import { CalendarPicker } from "@/core/components/calendarPicker";
import Loader from "@/core/components/loader/loader";
import { SelectOption } from "@/core/components/select-option";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const selectStatusFilter = [
  {
    value: "all",
    item: "All",
  },
  {
    value: "pending",
    item: "Pending",
  },
  {
    value: "rejected",
    item: "Rejected",
  },
  {
    value: "canceled",
    item: "Canceled",
  },
  {
    value: "accepted",
    item: "Accepted",
  },
  {
    value: "inProgressRequest",
    item: "In Progress",
  },
  {
    value: "inProgressAccepted",
    item: "On Going",
  },
  {
    value: "done",
    item: "Done",
  },
  {
    value: "expired",
    item: "Expired",
  },
];

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
        return response.data.data as TGetUserBooking[];
      }),
    enabled: !!session?.user?.id,
  });

  // const { ref, inView } = useInView();

  // const {
  //   status,
  //   data,
  //   error,
  //   isFetching,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  // } = useInfiniteQuery(
  //   ["projects"],
  //   async ({ pageParam = 0 }) => {
  //     const res = await axios.get("/api/projects?cursor=" + pageParam);
  //     return res.data;
  //   },
  //   {
  //     getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
  //     getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  //   }
  // );

  // React.useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [inView]);

  console.log(bookingData);

  if (bookingListLoading) {
    return <Loader />;
  }

  return (
    <main className="wrapper px-4 pt-10 pb-20">
      <h1 className="text-xl sm:text-2xl font-bold mb-5">Booking History</h1>
      <div className="flex items-center justify-between sm:justify-start gap-8 mb-5 sm:w-[25vw]">
        <CalendarPicker calendarTitle="Semua Tanggal" />
        <SelectOption
          onValueChange={() => {}}
          selectList={selectStatusFilter}
          placeholder="Pilih Status"
        />
      </div>
      <div className="relative grid gap-5 max-h-[70vh] overflow-auto no-scrollbar z-0">
        {bookingData !== undefined &&
          bookingData.map((value, index) => (
            <div key={index}>
              <BookingCard
                bookImgAlt={value.bookingId}
                estimatePrice={{
                  estimatePriceMax: value.bookingPriceMax
                    ? value.bookingPriceMax.toString()
                    : "",
                  estimatePriceMin: value.bookingPriceMin
                    ? value.bookingPriceMin.toString()
                    : "",
                }}
                bookingComplaintImg={value.bookingPhotoUrl}
                bookingComplaintDesc={value.bookingComplain}
                imgSource={value.merchant.merchantPhotoUrl}
                imgAlt={value.merchant.merchantName}
                orderId={value.bookingId ? value.bookingId : ""}
                merchName={value.merchant.merchantName}
                time={value.bookingSchedule.toString()}
                status={value.bookingStatus}
              />
            </div>
          ))}
      </div>
    </main>
  );
};

export default BookingPage;
