import React from "react";
import TeknisiTerdekatCard from "../components/teknisiTerdekatCard";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Card } from "@/core/components/ui/card";

const TeknisiTerdekat = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Teknisi Terdekatmu</h2>
        <h3 className="flex font-thin pr-10 gap-5">
          <MapPinIcon /> Bogor
        </h3>
      </div>
      <div className="pt-10">
        <TeknisiTerdekatCard>
          <div className="flex justify-start items-center gap-10">
            <div>
              <Image
                className="rounded-full flex justify-center items-center"
                src="/AdamSucipto.svg"
                alt="AdamSucipto"
                width={100}
                height={100}
              />
            </div>
            <div className="grid place-items-start gap-3">
              <h1 className="text-xl font-semibold">Adam Sucipto</h1>
              <div className="flex gap-4">
                <Card className="border border-gra px-4 py-2 rounded-lg">
                  #Service-AC
                </Card>
                <Card className="px-4 py-2 ">#Bogor</Card>
                <Card className=" px-4 py-2 flex justify-center items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Online
                </Card>
              </div>
            </div>
          </div>
        </TeknisiTerdekatCard>
      </div>
      <div className="pt-10">
        <TeknisiTerdekatCard>
          <div className="flex justify-start items-center gap-10">
            <div>
              <Image
                className="rounded-full flex justify-center items-center"
                src="/AdamSucipto.svg"
                alt="AdamSucipto"
                width={100}
                height={100}
              />
            </div>
            <div className="grid place-items-start gap-3">
              <h1 className="text-xl font-semibold">Adam Sucipto</h1>
              <div className="flex gap-4">
                <Card className="border border-gra px-4 py-2 rounded-lg">
                  #Service-AC
                </Card>
                <Card className="px-4 py-2 ">#Bogor</Card>
                <Card className=" px-4 py-2 flex justify-center items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Online
                </Card>
              </div>
            </div>
          </div>
        </TeknisiTerdekatCard>
      </div>
      <div className="pt-10">
        <TeknisiTerdekatCard>
          <div className="flex justify-start items-center gap-10">
            <div>
              <Image
                className="rounded-full flex justify-center items-center"
                src="/AdamSucipto.svg"
                alt="AdamSucipto"
                width={100}
                height={100}
              />
            </div>
            <div className="grid place-items-start gap-3">
              <h1 className="text-xl font-semibold">Adam Sucipto</h1>
              <div className="flex gap-4">
                <Card className="border border-gra px-4 py-2 rounded-lg">
                  #Service-AC
                </Card>
                <Card className="px-4 py-2 ">#Bogor</Card>
                <Card className=" px-4 py-2 flex justify-center items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Online
                </Card>
              </div>
            </div>
          </div>
        </TeknisiTerdekatCard>
      </div>
      <div className="pt-10">
        <TeknisiTerdekatCard>
          <div className="flex justify-start items-center gap-10">
            <div>
              <Image
                className="rounded-full flex justify-center items-center"
                src="/AdamSucipto.svg"
                alt="AdamSucipto"
                width={100}
                height={100}
              />
            </div>
            <div className="grid place-items-start gap-3">
              <h1 className="text-xl font-semibold">Adam Sucipto</h1>
              <div className="flex gap-4">
                <Card className="border border-gra px-4 py-2 rounded-lg">
                  #Service-AC
                </Card>
                <Card className="px-4 py-2 ">#Bogor</Card>
                <Card className=" px-4 py-2 flex justify-center items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Online
                </Card>
              </div>
            </div>
          </div>
        </TeknisiTerdekatCard>
      </div>
    </div>
  );
};

export default TeknisiTerdekat;
