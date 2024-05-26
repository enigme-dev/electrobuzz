"use client";
import React from "react";
import { Card } from "../../core/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingStatus from "./bookingStatus";
import { Clock, MapPin } from "lucide-react";
import { BookStatusEnum } from "@/bookings/types";
import { format } from "date-fns";
import { stat } from "fs";
import Link from "next/link";
import { Button } from "@/core/components/ui/button";

interface BookingCardProps {
  imgSource: string;
  imgAlt: string;
  orderId: string;
  merchName: string;
  bookingSchedule: string;
  bookingCreatedAt: string;
  isMerchant?: boolean;
  status?: BookStatusEnum;
  bookingComplaintImg?: string;
  bookImgAlt?: string;
  bookingComplaintDesc?: string;
  estimatePrice?: { estimatePriceMin: string; estimatePriceMax: string };
}

const BookingCard = ({
  bookingComplaintImg,
  bookImgAlt,
  orderId,
  merchName,
  bookingSchedule,
  bookingCreatedAt,
  status,
  imgSource,
  imgAlt,
  isMerchant,
  bookingComplaintDesc,
  estimatePrice,
}: BookingCardProps) => {
  const router = useRouter();
  console.log(status);
  return (
    <div>
      {" "}
      <Card
        onClick={() => {
          isMerchant
            ? router.push(`/merchant/dashboard/transaction?id=${orderId}`)
            : router.push(`/user/my-bookings/${orderId}`);
        }}
        className="w-full cursor-pointer z-0 p-3 grid gap-4 max-w-screen"
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-4 ">
            <div>
              <Image
                className="aspect-square w-[40px] h-[40px] sm:w-[70px] sm:h-[70px] rounded-full flex justify-center items-center"
                src={imgSource}
                alt={imgAlt}
                width={100}
                height={100}
              />
            </div>
            <div className="grid place-items-start gap-1 max-w-32 sm:max-w-80 overflow-hidden ">
              <h1 className="text-xs sm:text-lg font-semibold">{merchName}</h1>
              <div className="flex gap-1 items-center text-gray-400 text-[0.6rem] sm:text-sm">
                <Clock size={14} />
                <p>{format(bookingCreatedAt, "PPP")}</p>
              </div>
            </div>
          </div>
          <div className="pr-4">
            <BookingStatus status={status ? status : undefined} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Image
              src={bookingComplaintImg ? bookingComplaintImg : ""}
              alt={bookImgAlt ? bookImgAlt : ""}
              className="w-[40px] h-[40px] sm:w-[70px] sm:h-[70px] rounded-lg"
              width={100}
              height={100}
            />
          </div>
          <div className="max-w-[200px] sm:max-w-screen-md">
            <p className="truncate text-xs sm:text-lg">
              {bookingComplaintDesc}
            </p>
            <p className="text-gray-400 text-xs sm:text-md">
              Permintaan Tanggal Janji: {format(bookingSchedule, "PPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold">Estimasi Harga</h2>
            <p className="text-xs text-gray-400">
              {estimatePrice?.estimatePriceMax &&
              estimatePrice.estimatePriceMin !== undefined
                ? `Rp.${estimatePrice.estimatePriceMin} - Rp.${estimatePrice.estimatePriceMax}`
                : "-"}
            </p>
          </div>
          <div>
            <div>
              {isMerchant ? (
                <></>
              ) : (
                <Link href="">
                  <Button variant={"outline"} className="text-xs px-3 py-1">
                    Booking lagi
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCard;
