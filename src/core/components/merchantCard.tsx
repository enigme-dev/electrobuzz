"use client";

import { Card } from "@/core/components/ui/card";
import { getRoundedRating } from "@/core/lib/utils";
import { MapPinIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CategoryBadge from "./categoryBadge";

interface Props {
  imgSource: string;
  imgAlt: string;
  merchName: string;
  serviceCategory: string[];
  location: string;
  merchantId: string;
  distance?: number;
  merchantRating: number;
  banner?: string;
  merchantReviewCt?: number;
}

export default function MerchantCard({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  location,
  merchantId,
  distance,
  merchantRating,
  banner,
  merchantReviewCt,
}: Props) {
  const parsedDistance =
    (distance ?? 0) >= 1000
      ? `${((distance ?? 0) / 1000).toFixed(1)} km`
      : `${distance} m`;

  return (
    <Link href={`/merchant/${merchantId}`}>
      <Card className="w-full h-full shadow-sm sm:shadow-md cursor-pointer">
        <div className="w-full">
          {banner ? (
            <Image
              className="w-full h-[120px] bg-gray-200 rounded-t-md object-cover"
              src={banner ?? ""}
              alt={imgAlt}
              width={520}
              height={120}
            />
          ) : (
            <div className="w-full h-[120px] bg-gray-200 rounded-t-md"></div>
          )}
        </div>
        <div className="flex gap-3 items-center p-2">
          <Image
            className="h-[48px] w-[48px] rounded-full object-cover"
            src={imgSource}
            alt={imgAlt}
            width={48}
            height={48}
          />
          <div className="overflow-hidden">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-[0.9375rem] truncate">
                {merchName}
              </span>
            </div>

            <div className="flex gap-1 items-center text-xs ">
              <MapPinIcon size={15} />
              <span className="truncate text-gray-700 dark:text-gray-400">
                {location}
              </span>
              {distance ? <span> | {parsedDistance}</span> : <></>}
            </div>
            <div className="flex items-center mt-1">
              <Star size={17} fill="orange" strokeWidth={0} />
              <p className="text-[0.6rem] sm:text-xs">
                {merchantRating != 0
                  ? `${merchantRating.toFixed(1)} (${merchantReviewCt})`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 pb-2 ">
          <ul className="flex gap-1 flex-wrap">
            {serviceCategory.map((category) => (
              <CategoryBadge categoryName={category} key={category} />
            ))}
          </ul>
        </div>
      </Card>
    </Link>
  );
}
