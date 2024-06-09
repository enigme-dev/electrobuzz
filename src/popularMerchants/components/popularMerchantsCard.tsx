"use client";
import { Card } from "@/core/components/ui/card";
import { getRoundedRating } from "@/core/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lightbulb, MapPinIcon, PinIcon, Star } from "lucide-react";
import { useSession } from "next-auth/react";
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
  distance?: number;
  merchantRating: number;
  merchantReviewCt?: number;
}

const PopularMerchantsCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  location,
  merchantId,
  distance,
  merchantRating,
  merchantReviewCt,
}: Props) => {
  const router = useRouter();

  const renderedCategories = serviceCategory.slice(0, 5).join(", ");

  const roundedRating = getRoundedRating(merchantRating);

  return (
    <div
      className="mt-10 hover:cursor-pointer "
      onClick={() => {
        router.push(`/merchant/${merchantId}`);
      }}
    >
      <div className="sm:w-[20rem] w-[15rem] h-[20rem] sm:h-[25rem] bg-white border rounded-lg shadow dark:bg-slate-950 ">
        <Image
          className="rounded-t-lg object-cover object-center h-[150px] w-full "
          src={imgSource}
          alt={imgAlt}
          width={500}
          height={300}
        />

        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-sm sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              {merchName}
            </h5>
          </a>
          <div className="grid gap-2 place-items-start">
            <p className=" text-sm font-normal text-gray-700 dark:text-gray-400">
              {merchantRating ? (
                <div className="flex items-center gap-1 ">
                  <Star size={15} fill="orange" strokeWidth={0} />
                  <p className="text-[0.6rem] sm:text-xs">{roundedRating} </p>
                  <p className="text-[0.6rem] sm:text-xs">
                    ({merchantReviewCt}){" "}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {" "}
                  <Star size={15} strokeWidth={1} className="text-orange-400" />
                  <p className="text-gray-400 text-[0.6rem] sm:text-xs">
                    Belum ada rating
                  </p>
                </div>
              )}
            </p>
            <div className="flex gap-1 items-center">
              <Lightbulb
                size={15}
                className="text-gray-700 dark:text-gray-400"
              />
              <p className=" text-[0.6rem] sm:text-sm font-normal text-gray-700 dark:text-gray-400 max-w-[150px] sm:max-w-[250px]">
                {renderedCategories}
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <MapPinIcon
                size={15}
                className="text-gray-700 dark:text-gray-400"
              />
              <p className=" text-[0.6rem] sm:text-sm font-normal text-gray-700 dark:text-gray-400">
                {location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularMerchantsCard;
