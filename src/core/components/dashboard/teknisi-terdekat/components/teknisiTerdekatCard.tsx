import { Card } from "@/core/components/ui/card";
import Image from "next/image";
import React, { ReactNode } from "react";

interface Props {
  imgSource: string;
  imgAlt: string;
  merchName: string;
  serviceCategory: string;
  location: string;
  status: "online" | "offline";
}

const TeknisiTerdekatCard: React.FC<Props> = ({
  imgSource,
  imgAlt,
  merchName,
  serviceCategory,
  status,
  location,
}: Props) => {
  return (
    <div>
      <Card className="p-6 w-full hover:shadow-lg cursor-pointer transition duration-500">
        <div className="flex justify-start items-center gap-10">
          <div>
            <Image
              className="rounded-full flex justify-center items-center"
              src={imgSource}
              alt={imgAlt}
              width={100}
              height={100}
            />
          </div>
          <div className="grid place-items-start gap-3">
            <h1 className="text-xl font-semibold">{merchName}</h1>
            <div className="flex gap-4">
              <Card className="border border-gra px-4 py-2 rounded-lg">
                {serviceCategory}
              </Card>
              <Card className="px-4 py-2 ">{location}</Card>
              <Card className=" px-4 py-2 flex justify-center items-center gap-2">
                {status === "online" && (
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                )}
                {status === "offline" && (
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                )}
                {status}
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeknisiTerdekatCard;
