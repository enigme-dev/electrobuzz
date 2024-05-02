import React from "react";
import TeknisiTerdekatCard from "../components/popularMerchantsCard";
import { MapPinIcon } from "lucide-react";
import MerchantCard from "../components/popularMerchantsCard";
import Image from "next/image";

const PopularMerchants = () => {
  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold pb-3">Teknisi Terpopuler</h2>
      </div>
      <div className="flex items-center justify-center">
        <div className=" max-h-[50vh] w-[50%] overflow-auto p-10 rounded-lg border">
          <div>
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              serviceCategory={["serviceAC"]}
              location={"Bogor"}
              merchantId="asdasda-asfsa-fafs-safs"
            />
          </div>
          <div className="pt-10">
            {" "}
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              serviceCategory={["serviceAC"]}
              location={"Bogor"}
              merchantId="asdasda-asfsa-fafs"
            />
          </div>
          <div className="pt-10">
            {" "}
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asdasda-fafs-safs"
            />
          </div>
          <div className="pt-10">
            {" "}
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
          <div className="pt-10">
            {" "}
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
          <div className="pt-10">
            {" "}
            <MerchantCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
        </div>
        <Image
          src={"/Electrician-rafiki.svg"}
          alt="Electrician-rafiki"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default PopularMerchants;
