import { CarouselImage } from "@/core/components/carousel-image";
import { Button } from "@/core/components/ui/button";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MerchantDashboardProfile = () => {
  return (
    <div className="">
      {/* <Image src={"/AdamSucipto.svg"} alt="adam-sucipto" /> */}
      <div className="">
        <div className="relative flex flex-col gap-4 items-start justify-end">
          <Image
            src={"/AdamSucipto.svg"}
            alt="adam-sucipto"
            width={300}
            height={300}
            className="object-cover w-full h-[40vh] brightness-50 object-center"
          />
          <div className="absolute grid gap-3 p-5">
            <h1 className="text-3xl text-white">Adam Sucipto</h1>
            <h2 className="text-2xl text-white flex  items-center gap-2">
              Servis AC
            </h2>
            <h2 className="text-2xl text-white flex  items-center gap-2">
              <span>
                <MapPinIcon />
              </span>
              Bogor
            </h2>
          </div>
          {/* <StatusMerchant status={"online"} /> */}
        </div>
      </div>
      <div className="px-4">
        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          {/* <div className="">
            <CarouselImage
              carouselContent={
                <Image
                  src="/biaya-service-ac.svg"
                  width={500}
                  height={500}
                  alt="biaya-service-ac"
                  className="object-contain w-full"
                />
              }
            />
          </div> */}
          <div className="grid gap-2">
            <h1 className="text-bold text-2xl pt-6">Album</h1>
            <div className="flex"></div>
            <h1 className="text-bold text-2xl pt-6">Deskripsi</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h1 className="text-bold text-2xl pt-6">Kategori</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h1 className="text-bold text-2xl pt-6">Location</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboardProfile;
