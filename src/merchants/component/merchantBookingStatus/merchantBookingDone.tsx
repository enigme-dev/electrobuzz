import {
  TBookingReasonSchema,
  TGetMerchantBookingDone,
  TGetMerchantBookingInProgress,
  TGetUserBooking,
  TGetUserBookingDone,
  TGetUserBookingRejected,
} from "@/bookings/types";
import StarRating from "@/core/components/starRating";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MerchantBookingDoneProps {
  bookingDetailData: TGetMerchantBookingDone;
}

const MerchantBookingDone = ({
  bookingDetailData,
}: MerchantBookingDoneProps) => {
  console.log(bookingDetailData);
  return (
    <div>
      <div>
        {" "}
        <div className="flex items-center justify-center pt-10">
          <Image
            src={"/done-icon.svg"}
            width={100}
            height={100}
            alt={"done-icon"}
          />
        </div>
        <div className="grid gap-5 pt-10">
          <div className="grid place-items-center ">
            <h1 className=" text-md  sm:text-2xl font-bold p-3  ">
              Booking ini telah selesai...
            </h1>{" "}
          </div>
          <div className="shadow-lg border  p-5 rounded-lg space-y-5">
            <h1 className="font-semibold text-md sm:text-xl text-center">
              Keluhan Pengguna
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
            {bookingDetailData.review ? (
              <Card className="p-5 ">
                <h1 className="font-bold">{bookingDetailData.user.name}</h1>
                <div className="flex items-center">
                  <h2>Rating:</h2>
                  <StarRating
                    userRating={
                      bookingDetailData.review
                        ? bookingDetailData.review.reviewStars
                        : 0
                    }
                  />
                </div>
                <p className="md:max-w-[70vw] max-w-[60vw] break-words">
                  Review: {bookingDetailData.review?.reviewBody}
                </p>
              </Card>
            ) : (
              <></>
            )}
          </div>
          <Link
            className="flex justify-center"
            href={"/merchant/dashboard/transaction"}
          >
            <Button variant={"outline"}>Kembali</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MerchantBookingDone;
