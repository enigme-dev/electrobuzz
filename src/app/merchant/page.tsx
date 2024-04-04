import TeknisiTerdekatCard from "@/core/components/dashboard/teknisi-terdekat/components/teknisiTerdekatCard";
import React from "react";

export default function MerchantPage() {
  return (
    <main className="wrapper py-20">
      <div className="flex justify-between">
        <h1>Air Conditioner</h1>
        <h2>Bogor</h2>
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
        <TeknisiTerdekatCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          merchName={"Adam Sucipto"}
          serviceCategory={"#service-ac"}
          location={"Bogor"}
          status={"offline"}
        />
      </div>
    </main>
  );
}
