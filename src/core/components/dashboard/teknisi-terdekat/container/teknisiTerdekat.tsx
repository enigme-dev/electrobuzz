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
        <TeknisiTerdekatCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          serviceCategory={"#service-ac"}
          location={"Bogor"}
          status={"offline"}
        />
      </div>
      <div className="pt-10">
        {" "}
        <TeknisiTerdekatCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          serviceCategory={"#service-ac"}
          location={"Bogor"}
          status={"online"}
        />
      </div>
      <div className="pt-10">
        {" "}
        <TeknisiTerdekatCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          location={"Bogor"}
          serviceCategory={"#service-ac"}
          status={"online"}
        />
      </div>
      <div className="pt-10">
        {" "}
        <TeknisiTerdekatCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          location={"Bogor"}
          serviceCategory={"#service-ac"}
          status={"online"}
        />
      </div>
    </div>
  );
};

export default TeknisiTerdekat;
