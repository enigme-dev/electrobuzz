import { Button } from "@/core/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface RegisterAsMerchantStartProps {
  onNext: Function;
}

const RegisterAsMerchantStart = ({ onNext }: RegisterAsMerchantStartProps) => {
  return (
    <div className="grid place-items-center place-content-center h-[80vh] gap-5">
      <Image
        src={"/Career progress-cuate.svg"}
        alt="careerProgressCuate"
        width={300}
        height={300}
      />
      <div className="text-center">
        <h1 className="font-bold sm:text-4xl text-md">
          Mulai karirmu menjadi teknisi bersama
        </h1>
      </div>
      <h2 className="text-3xl ">ElectroBu⚡z</h2>
      <Button
        variant={"default"}
        className="text-black bg-yellow-400 dark:text-white hover:bg-yellow-300"
        onClick={() => onNext()}
      >
        Mulai Sekarang
      </Button>
    </div>
  );
};

export default RegisterAsMerchantStart;
