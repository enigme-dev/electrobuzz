"use client";
import React from "react";
import { Card } from "../../core/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingStatus from "./bookingStatus";
import { MapPin } from "lucide-react";

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
        className="w-full hover:shadow-lg cursor-pointer transition duration-500"
      >
        <div className="flex justify-start items-center gap-10">
          <div>
            <Image
              className="aspect-square p-3 rounded-full flex justify-center items-center"
              src={imgSource}
              alt={imgAlt}
              width={100}
              height={100}
            />
          </div>
          <div className="grid place-items-start gap-3">
            <h1 className="text-sm sm:text-md font-semibold">{merchName}</h1>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <MapPin className="w-4" />
                <p className="text-xs sm:text-md  ">{location}</p>
              </div>
              <BookingStatus status={status} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingCard;
