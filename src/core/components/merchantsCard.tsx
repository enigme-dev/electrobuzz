"use client";
import { Card } from "@/core/components/ui/card";
import { Lightbulb, MapPinIcon, PinIcon, Star } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  imgSource: string;
  imgAlt: string;
  merchName: string;
  serviceCategory: string[];
  location: string;
  merchantId: string;
  distance: number;
}

const MerchantsCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  location,
  merchantId,
  distance,
}: Props) => {
  const router = useRouter();
  return (
    <div>
      <Card
        onClick={() => {
          router.push(`/merchant/${merchantId}`);
        }}
        className="flex w-full shadow-sm sm:shadow-lg cursor-pointer  transition duration-500"
      >
        <div className="flex gap-5 sm:gap-10 items-center p-3">
          <div>
            <Image
              className="aspect-square p-3 rounded-full flex justify-center items-center"
              src={imgSource}
              alt={imgAlt}
              width={70}
              height={70}
            />
          </div>
          <div className="grid place-items-start gap-1">
            <h1 className="text-sm sm:text-md font-semibold ">{merchName}</h1>
            <div className="flex gap-4 items-center">
              <h2 className="rounded-lg text-gray-400 text-[0.6rem] sm:text-sm flex items-center gap-2">
                <Lightbulb className="w-4" />
                {serviceCategory}
              </h2>
              <h2 className="text-gray-400 text-[0.6rem] sm:text-sm  flex items-center gap-2 ">
                <MapPinIcon className="w-4 " />
                {location}
              </h2>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm">4,8/5</p>
            <Star size={20} />
          </div> */}
        </div>
        <span>{distance + " meters"}</span>
      </Card>
    </div>
  );
};

export default MerchantsCard;
