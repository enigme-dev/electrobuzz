import * as React from "react";
import Image from "next/image";
import { Button } from "../core/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

export function Banner() {
  return (
    <div className="w-full">
      <div className="flex justify-center flex-col sm:flex-row sm:justify-around items-center">
        <div className="">
          <Image
            className="rounded-full"
            src="/Online world-cuate.svg"
            alt="banner"
            width={420}
            height={420}
          />
        </div>
        <div>
          <h1 className="font-bold sm:text-4xl text-center text-xl">
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
          <div className="text-center pt-5">
            <Link href="/merchant-list">
              <Button
                variant="default"
                className="bg-yellow-400 hover:bg-yellow-300 text-md text-black sm:text-lg"
              >
                <span className="flex gap-2 items-center">
                  {" "}
                  <Search /> Cari Teknisi Favoritmu
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
