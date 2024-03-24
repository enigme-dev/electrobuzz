import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export function Banner() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="">
          <Image
            className="rounded-full "
            src="/Banner.svg"
            alt="banner"
            width={420}
            height={420}
          />
        </div>
        <div>
          <h1 className="font-bold text-4xl pr-10">
            Elektronik Servis{" "}
            <span className="px-1 rounded-lg bg-gradient-to-br from-white to-yellow-300 dark:from-[#020817] ">
              mudah
            </span>{" "}
            <br /> dan{" "}
            <span className="px-1 rounded-lg bg-gradient-to-br from-white to-yellow-300 dark:from-[#020817]">
              terpercaya
            </span>{" "}
            hanya di <br /> <span className="text-">Electrobuzz</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
