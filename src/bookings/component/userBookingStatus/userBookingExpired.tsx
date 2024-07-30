import {
  TBookingReasonSchema,
  TGetMerchantBookingInProgress,
  TGetUserBooking,
  TGetUserBookingRejected,
} from "@/bookings/types";
import { Button } from "@/core/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BookingStatus from "../bookingStatus";
import { EyeIcon } from "lucide-react";
import Modal from "@/core/components/modal";

interface UserBookingExpiredProps {
  bookingDetailData: TGetUserBooking;
}

const UserBookingExpired = ({ bookingDetailData }: UserBookingExpiredProps) => {
  const [imageFullscreen, setImageFullscreen] = useState(false);

  return (
    <div className="flex items-center justify-center mt-10 gap-10 lg:gap-20 flex-col lg:flex-row">
      {" "}
      <div className="">
        <div className="grid gap-5 w-fit wrapper">
          <Image
            src={"/No data-cuate.svg"}
            width={500}
            height={500}
            alt={"No data-cuate"}
          />
          <h1 className=" text-2xl font-bold text-center">
            Booking ini telah expired...
          </h1>
        </div>
      </div>
      <div className="shadow-lg border p-5 rounded-lg space-y-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-md sm:text-xl ">Keluhan User</h1>
          <BookingStatus status="expired" />
        </div>
        <div>
          <h2 className="pt-2 text-sm sm:text-xl">Foto Keluhan:</h2>
          <div
            onClick={() => setImageFullscreen(true)}
            className="flex justify-center max-w-[200px] max-h-[200px] relative group pt-5 hover:opacity-50 cursor-pointer"
          >
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingPhotoUrl}
              className=""
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
          <h2 className="pt-2 text-left text-sm sm:text-xl">Tanggal Janji:</h2>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
          </p>
        </div>
        <div>
          <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {bookingDetailData.addressDetail}, {bookingDetailData.addressCity},{" "}
            {bookingDetailData.addressProvince},{" "}
            {bookingDetailData.addressZipCode}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href={"/user/my-bookings"}>
            <Button variant={"outline"}>Kembali</Button>
          </Link>
        </div>
      </div>
      <div>
        <Modal
          imageUrl={bookingDetailData.bookingPhotoUrl}
          setShowModal={setImageFullscreen}
          showModal={imageFullscreen}
        />
      </div>
    </div>
  );
};

export default UserBookingExpired;
