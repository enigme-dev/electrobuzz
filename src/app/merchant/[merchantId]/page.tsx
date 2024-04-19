"use client";
import StatusMerchant from "@/core/components/merchant/statusMerchant";
import { Button } from "@/core/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MerchantDetailPage = () => {
  const pathname = usePathname();
  return (
    <div className="wrapper py-10">
      {/* <Image src={"/AdamSucipto.svg"} alt="adam-sucipto" /> */}
      <div className="pt-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          <Image
            src={"/AdamSucipto.svg"}
            alt="adam-sucipto"
            width={200}
            height={200}
            className="rounded-full"
          />
          <p className="text-2xl">Adam Sucipto</p>
          <StatusMerchant status={"online"} />
        </div>
      </div>
      <div className="grid gap-4 pt-10">
        <h1 className="text-bold text-2xl">Foto album</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h1 className="text-bold text-2xl">Deskripsi</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <h1 className="text-bold text-2xl">Ulasan</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
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
  );
};

export default MerchantDetailPage;
