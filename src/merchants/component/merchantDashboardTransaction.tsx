import BookingCard from "@/booking-history/component/bookingCard";
import { TBookingModel, TGetMerchantBookings } from "@/bookings/types";
import { CalendarPicker } from "@/core/components/calendarPicker";
import Loader from "@/core/components/loader/loader";
import { SelectOption } from "@/core/components/select-option";
import { useQuery } from "@tanstack/react-query";
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
const MerchantDashboardTransaction = () => {
  const { data: session } = useSession();
  const {
    isLoading: bookingListLoading,
    error: bookingError,
    data: bookingDataAsMerchant,
  } = useQuery({
    queryKey: ["getBookingDataAsMerchant", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/booking`).then((response) => {
        return response.data.data as TGetMerchantBookings;
      }),
    enabled: !!session?.user?.id,
  });

  console.log(bookingDataAsMerchant);

  if (bookingListLoading) {
    return <Loader />;
  }
  return (
    <main className="px-4 pt-10 w-full">
      <h1 className="text-xl sm:text-2xl font-bold pb-10">Transactions</h1>
      <div className="flex items-center justify-between sm:justify-start gap-8 mb-5 sm:w-[25vw]">
        <CalendarPicker calendarTitle="Pilih Tanggal" />
        <SelectOption
          onValueChange={() => {}}
          selectList={selectStatusFilter}
          placeholder="Pilih Status"
        />
      </div>
      <div className=" grid gap-5 max-h-[70vh] overflow-auto no-scrollbar pb-20 sm:pb-5">
        {bookingDataAsMerchant !== undefined &&
          bookingDataAsMerchant.map((value, index) => (
            <div key={index}>
              <BookingCard
                bookImgAlt={value.bookingId}
                bookingComplaintImg={value.bookingPhotoUrl}
                bookingComplaintDesc={value.bookingComplain}
                estimatePrice={{
                  estimatePriceMax: value.bookingPriceMax
                    ? value.bookingPriceMax.toString()
                    : "",
                  estimatePriceMin: value.bookingPriceMin
                    ? value.bookingPriceMin.toString()
                    : "",
                }}
                imgSource={value.user.image}
                imgAlt={value.user.name}
                orderId={value.bookingId ? value.bookingId : ""}
                merchName={value.user.name}
                bookingSchedule={value.bookingSchedule.toString()}
                bookingCreatedAt={
                  value.bookingCreatedAt
                    ? value.bookingCreatedAt?.toString()
                    : ""
                }
                status={value.bookingStatus ? value.bookingStatus : "expired"}
                isMerchant={true}
              />
            </div>
          ))}
      </div>
    </main>
  );
};
export default MerchantDashboardTransaction;
