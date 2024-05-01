import React from "react";
import TeknisiTerdekatCard from "../components/merchantCard";
import { MapPinIcon } from "lucide-react";
import MerchantCard from "../components/merchantCard";

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
        <MerchantCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          serviceCategory={["serviceAC"]}
          location={"Bogor"}
          status={"offline"}
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
          status={"online"}
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
          status={"online"}
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
          status={"online"}
          merchantId="asfsa-fafs-safs"
        />
      </div>
    </div>
  );
};

export default TeknisiTerdekat;
