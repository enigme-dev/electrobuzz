import BookingCard from "@/booking-history/component/bookingCard";
import { TBookingModel, TGetMerchantBookings } from "@/bookings/types";
import Loader from "@/core/components/loader/loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

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
      <div className=" grid gap-5 max-h-[70vh] overflow-auto no-scrollbar">
        {bookingDataAsMerchant !== undefined &&
          bookingDataAsMerchant.map((value, index) => (
            <div key={index}>
              <BookingCard
                imgSource={""}
                imgAlt={""}
                orderId={value.bookingId ? value.bookingId : ""}
                merchName={""}
                time={value.bookingSchedule.toString()}
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
