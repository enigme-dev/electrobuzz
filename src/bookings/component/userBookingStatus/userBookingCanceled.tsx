import {
  TGetMerchantBookingRejected,
  TGetUserBooking,
  TGetUserBookingReason,
} from "@/bookings/types";
import { Button } from "@/core/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface UserBookingCanceledProps {
  bookingDetailData: TGetUserBookingReason;
}
const UserBookingCanceled = ({
  bookingDetailData,
}: UserBookingCanceledProps) => {
  return (
    <div>
      <div>
        {" "}
        <div className="flex items-center justify-center ">
          <Image
            src={"/Discarded idea-cuate.svg"}
            width={500}
            height={500}
            alt={"Discarded idea-cuate"}
          />
        </div>
        <div className="grid gap-5 pt-10 wrapper">
          <div className="grid place-items-center ">
            <h1 className=" text-md text-white sm:text-2xl font-bold rounded-lg bg-red-500 p-3 w-fit ">
              Kamu sudah membatalkan orderan ini...
            </h1>{" "}
            <p className="text-lg pt-2 sm:text-md grid place-items-center">
              <span className="font-semibold text-sm sm:text-lg">
                Dengan alasan:{" "}
              </span>
              <p className="max-w-screen-lg text-wrap break-words text-sm sm:text-lg pt-2">
                {bookingDetailData.bookingReason}
              </p>
            </p>
          </div>
          <div className="shadow-lg border p-5 rounded-lg space-y-5">
            <h1 className="font-semibold text-md sm:text-xl text-center">
              Keluhan User
            </h1>
            <div>
              <h2 className="pt-2 text-sm sm:text-xl text-center">
                Foto Keluhan:
              </h2>
              <div className="flex justify-center">
                <Image
                  src={bookingDetailData.bookingPhotoUrl}
                  alt={bookingDetailData.bookingPhotoUrl}
                  className="pt-5"
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div>
              <h2 className="pt-2 text-left text-sm sm:text-xl">Keluhan:</h2>
              <p className=" text-left text-sm sm:text-lg font-semibold">
                {bookingDetailData.bookingComplain}
              </p>
            </div>

            <div>
              <h2 className="pt-2 text-left text-sm sm:text-xl">
                Tanggal Janji:
              </h2>
              <p className=" text-left text-sm sm:text-lg font-semibold">
                {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
              </p>
            </div>
            <div>
              <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
              <p className=" text-left text-sm sm:text-lg font-semibold">
                {bookingDetailData.addressDetail},{" "}
                {bookingDetailData.addressCity},{" "}
                {bookingDetailData.addressProvince},{" "}
                {bookingDetailData.addressZipCode}
              </p>
            </div>
          </div>
          <Link className="flex justify-center" href={"/user/my-bookings"}>
            <Button variant={"outline"}>Kembali</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBookingCanceled;
