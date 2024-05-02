"use client";
import React from "react";
import { Card } from "../../core/components/ui/card";
import Image from "next/image";
import StatusMerchant from "../../merchant/statusMerchant";
import { useRouter } from "next/navigation";
import BookingStatus from "./bookingStatus";

interface BookingCardProps {
  imgSource: string;
  imgAlt: string;
  orderId: string;
  merchName: string;
  location: string;
  status: "Awaiting" | "Denied" | "Accepted" | "In Progress" | "Completed";
}

const BookingCard = ({
  orderId,
  merchName,
  location,
  status,
  imgSource,
  imgAlt,
}: BookingCardProps) => {
  const router = useRouter();

  return (
    <div>
      {" "}
      <Card
        onClick={() => {
          router.push(`/bookings/${orderId}`);
        }}
        className="p-6 w-full hover:shadow-lg cursor-pointer transition duration-500"
      >
        <div className="flex justify-start items-center gap-10">
          <div>
            <Image
              className=" aspect-square rounded-full flex justify-center items-center"
              src={imgSource}
              alt={imgAlt}
              width={100}
              height={100}
            />
          </div>
          <div className="grid place-items-start gap-3">
            <h1 className="text-xl font-semibold">{merchName}</h1>
            <div className="flex gap-4">
              <Card className="px-4 py-2 ">{location}</Card>
              <BookingStatus status={status} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCard;
