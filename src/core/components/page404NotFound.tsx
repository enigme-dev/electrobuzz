import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Page404NotFound = () => {
  return (
    <div className="w-screen h-full flex justify-center mt-20">
      <div className="flex flex-col items-center">
        <Image
          src="/Feeling sorry-cuate.svg"
          alt="FeelingSorryCuate"
          width={300}
          height={300}
          className="aspect-square"
        />
        <h1 className="font-bold text-xl">Halaman ini tidak dapat ditemukan</h1>
        <p className="text-gray-400">
          Halaman yang anda cari tidak dapat ditemukan
        </p>
        <Link href={"/"}>
          <Button variant={"default"} className="text-black mt-5">
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page404NotFound;
