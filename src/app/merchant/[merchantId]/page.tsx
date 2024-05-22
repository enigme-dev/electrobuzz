"use client";
import { CarouselImage } from "@/core/components/carousel-image";
import Loader from "@/core/components/loader/loader";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { CarouselItem } from "@/core/components/ui/carousel";
import { useToast } from "@/core/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Lightbulb,
  MapPinIcon,
  Newspaper,
  PenBoxIcon,
  PlusIcon,
  Store,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

interface MerchantDetails {
  merchantPhotoUrl: string;
  merchantAvailable: boolean;
  merchantCategory: string[];
  merchantCity: string;
  merchantCreatedAt: string;
  merchantDesc: string;
  merchantId: string;
  merchantLat: number;
  merchantLong: number;
  merchantName: string;
  merchantProvince: string;
  merchantRating: number | null;
  merchantReviewCt: number | null;
  merchantVerified: boolean;
  merchantAlbums?: string[];
}

const MerchantDetailPage = () => {
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const merchantId = splitPathname.pop() || "";

  const {
    isLoading: getMerchantDetailsloading,
    error: getMerchantDetailsError,
    data: merchantDetails,
  } = useQuery({
    queryKey: ["getMerchantDetails", merchantId],
    queryFn: async () =>
      await axios.get(`/api/merchant/${merchantId}`).then((response) => {
        return response.data.data as MerchantDetails;
      }),
    enabled: !!merchantId,
  });

  console.log(merchantDetails?.merchantAlbums);

  if (getMerchantDetailsloading) {
    return <Loader />;
  }

  return (
    <div className="wrapper pb-20 ">
      {/* <Image src={"/AdamSucipto.svg"} alt="adam-sucipto" /> */}
      <div className="">
        <div className="relative flex flex-col gap-4 items-start justify-end w-full">
          <Image
            src={merchantDetails ? merchantDetails.merchantPhotoUrl : ""}
            alt={merchantDetails ? merchantDetails?.merchantName : ""}
            width={300}
            height={300}
            className="object-cover w-full h-[40vh] brightness-50 "
          />
          <div className="absolute grid gap-3 p-5">
            <h1 className="text-xl font-bold sm:text-3xl text-white">
              {merchantDetails?.merchantName}
            </h1>
            <h2 className="text-lg sm:text-2xl text-white flex  items-center gap-2">
              <span className="bg-yellow-400 rounded-lg py-1 px-2">
                <Lightbulb className="text-black w-4" />
              </span>
              {merchantDetails?.merchantCategory.map((value, index) => (
                <div key={index}>{value}</div>
              ))}
            </h2>
            <h2 className="text-lg sm:text-2xl text-white flex  items-center gap-2">
              <span className="bg-red-500 rounded-lg py-1 px-2">
                <MapPinIcon className="text-white w-4" />
              </span>
              {merchantDetails?.merchantCity}
            </h2>
          </div>
          {/* <StatusMerchant status={"online"} /> */}
        </div>
      </div>
      <div className="px-4 grid sm:grid-cols-2 sm:flex-row gap-8 pt-10 w-full ">
        <div className="w-full ">
          {merchantDetails?.merchantAlbums &&
          merchantDetails.merchantAlbums.length > 0 ? (
            <CarouselImage>
              {merchantDetails.merchantAlbums.map((value: any, index) => (
                <CarouselItem key={index}>
                  <Image
                    key={index}
                    src={
                      merchantDetails?.merchantAlbums ? value.albumPhotoUrl : ""
                    }
                    width={300}
                    height={300}
                    alt="biaya-service-ac"
                    className="object-contain w-full h-[320px]"
                  />
                </CarouselItem>
              ))}
            </CarouselImage>
          ) : (
            <div className="flex justify-center items-center w-full h-[200px] sm:h-[300px] bg-gray-100 dark:bg-slate-900 rounded-xl">
              <p>No Picture Available</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div>
            <h1 className="text-bold text-2xl flex items-center gap-4">
              Deskripsi{" "}
              <span className="bg-yellow-400 py-1 px-2 rounded-lg">
                <Newspaper className="text-black w-4" />
              </span>
            </h1>
            <p className="mt-10 flex items-center gap-4 max-w-[350px] sm:max-w-[500px] break-words">
              <span className="bg-green-500 py-1 px-2 rounded-lg">
                <PenBoxIcon className="text-white w-4" />
              </span>
              {merchantDetails?.merchantDesc}
            </p>
          </div>
          <div className="flex justify-center">
            <Link href={`${pathname}/buat-janji`}>
              <Card className="flex gap-5 items-center sm:w-52 bg-yellow-400 text-black dark:text-black hover:bg-yellow-300 px-5 py-2 mt-10 sm:mb-10">
                <PlusIcon width={15} />
                <p className="text-sm sm:text-lg">Buat Janji</p>
              </Card>
            </Link>
          </div>
        </div>
        {/* <div>
          <h1 className="text-bold text-2xl pt-10">Ulasan</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default MerchantDetailPage;
