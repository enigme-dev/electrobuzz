import React from "react";
import Image from "next/image";
import PopularMerchantsCard from "../components/popularMerchantsCard";

const PopularMerchants = () => {
  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-bold pb-10 pt-10">
          Teknisi Terpopuler
        </h2>
      </div>
      <div className="flex items-center justify-center">
        <div className=" grid gap-4 max-h-[70vh] w-full sm:w-[50%] overflow-auto sm:p-10 ">
          <div>
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              serviceCategory={["serviceAC"]}
              location={"Bogor"}
              merchantId="asdasda-asfsa-fafs-safs"
            />
          </div>
          <div>
            {" "}
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              serviceCategory={["serviceAC"]}
              location={"Bogor"}
              merchantId="asdasda-asfsa-fafs"
            />
          </div>
          <div>
            {" "}
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asdasda-fafs-safs"
            />
          </div>
          <div>
            {" "}
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
          <div>
            {" "}
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
          <div>
            {" "}
            <PopularMerchantsCard
              imgSource={"/AdamSucipto.svg"}
              imgAlt={"AdamSucipto"}
              merchName={"Adam Sucipto"}
              location={"Bogor"}
              serviceCategory={["serviceAC"]}
              merchantId="asfsa-fafs-safs"
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <Image
            src={"/Electrician-rafiki.svg"}
            alt="Electrician-rafiki"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default PopularMerchants;
