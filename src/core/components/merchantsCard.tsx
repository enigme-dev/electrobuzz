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
  const meterToKilometer = distance / 1000;
  const renderedCategories = serviceCategory.slice(0, 5).join(", ");
  const remainingCategories = serviceCategory.slice(5);

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
              width={85}
              height={85}
            />
          </div>
          <div className="grid place-items-start gap-1">
            <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
              <h1 className="text-sm sm:text-md font-semibold ">{merchName}</h1>
              <p className="text-xs text-gray-400">{meterToKilometer} Km</p>
            </div>
            <div className="flex gap-4 items-center ">
              <h2 className="rounded-lg text-gray-400 text-[0.6rem]  sm:text-sm flex items-center gap-2">
                <Lightbulb className="w-4" />
                <div>
                  <span>{renderedCategories}</span>
                  {remainingCategories.length > 0 && (
                    <span className="ml-1">...</span>
                  )}
                </div>
              </h2>
            </div>
            <h2 className="text-gray-400 text-[0.6rem] sm:text-sm  flex items-center gap-2 ">
              <MapPinIcon className="w-4 " />
              {location}
            </h2>
          </div>
          {/* <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm">4,8/5</p>
            <Star size={20} />
          </div> */}
        </div>
        <span></span>
      </Card>
    </div>
  );
};

export default MerchantsCard;
