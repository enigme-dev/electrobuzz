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

interface BookingCardProps {
  imgSource: string;
  imgAlt: string;
  orderId: string;
  merchName: string;
  time: string;
  isMerchant?: boolean;
  status: BookStatusEnum;
}

const BookingCard = ({
  orderId,
  merchName,
  time,
  status,
  imgSource,
  imgAlt,
  isMerchant,
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
        className="w-full cursor-pointer "
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            <div>
              <Image
                className="aspect-square p-3 rounded-full flex justify-center items-center"
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
                <p>{format(time, "PPP")}</p>
              </div>
            </div>
          </div>
          <div className="pr-4">
            <BookingStatus status={status} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCard;
