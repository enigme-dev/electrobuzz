"use client";
import { CarouselImage } from "@/core/components/caraouselImage";
import StatusMerchant from "@/core/components/merchant/statusMerchant";
import { Button } from "@/core/components/ui/button";
import {
  LocateIcon,
  LocateOffIcon,
  MapIcon,
  MapPinIcon,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MerchantDetailPage = () => {
  const pathname = usePathname();
  return (
    <div className="wrapper py-10">
      {/* <Image src={"/AdamSucipto.svg"} alt="adam-sucipto" /> */}
      <div className="">
        <div className="relative flex flex-col gap-4 items-start justify-end">
          <Image
            src={"/AdamSucipto.svg"}
            alt="adam-sucipto"
            width={300}
            height={300}
            className="object-cover w-full h-[40vh] brightness-50 rounded-sm"
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
      <div className="flex gap-4 pt-10">
        <div className="flex items-center justify-center">
          <CarouselImage
            carouselContent={
              <Image
                src="/biaya-service-ac.svg"
                width={500}
                height={500}
                alt="biaya-service-ac"
                className="object-contain"
              />
            }
          />
        </div>
        <div className="grid gap-2">
          <h1 className="text-bold text-2xl pt-6">Deskripsi</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="flex justify-end pt-10">
            <Link href={`${pathname}/buat-janji`}>
              <Button
                variant="outline"
                className="flex gap-3 justify-center items-center"
              >
                <PlusIcon width={20} />
                Buat janji
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <h1 className="text-bold text-2xl pt-10">Ulasan</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  );
};

export default MerchantDetailPage;
