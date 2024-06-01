"use client";
import { Card } from "@/core/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lightbulb, MapPinIcon, PinIcon, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { getRoundedRating } from "../lib/utils";

interface Props {
  imgSource: string;
  imgAlt: string;
  merchName: string;
  serviceCategory: string[];
  location: string;
  merchantId: string;
  distance: number;
  merchantRating: number;
}

const MerchantsCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  location,
  merchantId,
  distance,
  merchantRating,
}: Props) => {
  const { data: session } = useSession();
  const router = useRouter();

  const parsedDistance =
    distance >= 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance} m`;

  const renderedCategories = serviceCategory.slice(0, 5).join(", ");

  const roundedRating = getRoundedRating(merchantRating);

  return (
    <div>
      <Card
        onClick={() => {
          router.push(`/merchant/${merchantId}`);
        }}
        className="flex justify-between w-full shadow-sm sm:shadow-md  sm:hover:border-yellow-300 cursor-pointer  transition duration-500"
      >
        <div className="flex justify-between gap-5 sm:gap-10 items-center p-2 sm:p-3">
          <div className=" h-[70px] w-[70px] ">
            <Image
              className="rounded-full object-cover aspect-square "
              src={imgSource}
              alt={imgAlt}
              width={70}
              height={70}
            />
          </div>
          <div className="grid place-items-start">
            <div className="flex items-center gap-4 w-[100%]">
              <h1 className="text-xs sm:text-sm font-semibold max-w-[150px] overflow-hidden whitespace-nowrap">
                {merchName}
              </h1>
              {distance ? (
                <p className="text-[0.6rem] sm:text-xs text-gray-400">
                  {parsedDistance}
                </p>
              ) : (
                ""
              )}
            </div>

            <h2 className="text-gray-400 text-[0.6rem] sm:text-sm  flex items-center gap-2">
              <MapPinIcon className="w-4" />
              <p className="max-w-[200px] sm:max-w-full overflow-hidden whitespace-nowrap">
                {location}
              </p>
            </h2>
            <div className="rounded-lg text-gray-400 text-[0.6rem]  sm:text-sm flex items-center gap-2">
              <Lightbulb className="w-4" />
              <div className="max-w-[150px] md:max-w-full">
                <p>{renderedCategories}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pr-4">
          {merchantRating ? (
            <div className="flex flex-col sm:flex-row items-center gap-1 ">
              <Star size={15} fill="orange" strokeWidth={0} />
              <p className="text-[0.6rem] sm:text-xs">{roundedRating} </p>
            </div>
          ) : (
            <>
              {" "}
              <Star size={15} strokeWidth={1} className="text-orange-400" />
              <p className="hidden lg:block text-[0.6rem] sm:text-xs italic text-gray-400">
                belum ada rating
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MerchantsCard;
