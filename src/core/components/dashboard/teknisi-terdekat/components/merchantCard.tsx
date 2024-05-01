"use client";
import { Card } from "@/core/components/ui/card";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  imgSource: string;
  imgAlt: string;
  merchName: string;
  serviceCategory: string[];
  location: string;
  status: "online" | "offline";
  merchantId: string;
}

const MerchantCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  status,
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
        <div className="flex justify-start items-center gap-10">
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
            <div className="flex gap-4">
              <h2 className="rounded-lg text-sm">{serviceCategory}</h2>
              <h2 className="text-sm ">{location}</h2>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MerchantCard;
