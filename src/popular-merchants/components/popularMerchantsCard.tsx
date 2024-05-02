"use client";
import { Card } from "@/core/components/ui/card";
import { MapPinIcon, PinIcon, Star } from "lucide-react";
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
}

const PopularMerchantsCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  location,
  merchantId,
}: Props) => {
  const router = useRouter();
  return (
    <div>
      <Card
        onClick={() => {
          router.push(`/merchant/${merchantId}`);
        }}
        className="w-full hover:shadow-lg cursor-pointer transition duration-500"
      >
        <div className="flex gap-10 items-center p-3">
          <div>
            <Image
              className="p-3 rounded-full flex justify-center items-center"
              src={imgSource}
              alt={imgAlt}
              width={70}
              height={70}
            />
          </div>
          <div className="grid place-items-start gap-1">
            <h1 className="text-md font-semibold">{merchName}</h1>
            <div className="flex gap-4 items-center">
              <h2 className="rounded-lg text-sm">{serviceCategory}</h2>
              <h2 className="text-sm  flex items-center gap-2">
                <MapPinIcon className="w-4 " />
                {location}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">4,8/5</p>
              <Star />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PopularMerchantsCard;
