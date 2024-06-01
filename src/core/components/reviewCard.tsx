import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarRating from "./starRating";

interface ReviewCardProps {
  name: string;
  userRating?: number;
  userReview?: string;
  image: string;
  bookingPhotoUrl: string;
  bookingComplain: string;
  bookingId?: string;
  reviewCreatedAt?: Date;
}

const ReviewCard = ({
  name,
  userRating,
  bookingId,
  userReview,
  image,
  bookingPhotoUrl,
  bookingComplain,
  reviewCreatedAt,
}: ReviewCardProps) => {
  return (
    <Card className="w-full p-3 grid gap-4 max-w-screen">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-4 ">
          <div>
            <Image
              className="object-cover w-[30px] h-[30px] sm:w-[60px] sm:h-[60px] rounded-full flex justify-center items-center"
              src={image}
              alt={"imgAlt"}
              width={100}
              height={100}
            />
          </div>
          <div className="grid place-items-start gap-1 max-w-32 sm:max-w-80 overflow-hidden ">
            <h1 className="text-xs sm:text-lg font-semibold">{name}</h1>
            <p className="text-[0.6rem] sm:text-sm text-gray-400">
              {reviewCreatedAt ? format(reviewCreatedAt, "PPP") : ""}
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={bookingPhotoUrl ? bookingPhotoUrl : ""}
            alt={bookingComplain ? bookingComplain : ""}
            className="object-cover w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] rounded-lg"
            width={100}
            height={100}
          />
        </div>
        <div className="max-w-[200px] sm:max-w-screen-md">
          <p className="truncate text-xs sm:text-sm">{bookingComplain}</p>
        </div>
      </div>
      {userRating && userReview ? (
        <div className="">
          <div className="max-w-screen sm:max-w-screen-m ">
            <div className="flex items-center">
              <p className="text-xs sm:text-lg">Rating:</p>
              <StarRating userRating={userRating} />
            </div>
            <p className="truncate text-xs sm:text-lg">Review: {userReview}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Link href={`/user/my-bookings/${bookingId}`}>
            <Button variant={"outline"}>Beri ulasan</Button>
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between"></div>
    </Card>
  );
};

export default ReviewCard;
