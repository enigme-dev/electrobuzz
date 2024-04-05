import TeknisiTerdekatCard from "@/core/components/dashboard/teknisi-terdekat/components/teknisiTerdekatCard";
import { SelectOption } from "@/core/components/selectOption";
import { useParams } from "next/navigation";
import React from "react";

const categoryList = [
  {
    item: "Air Conditioner",
    value: "air-conditioner",
  },
  {
    item: "Washing Machine",
    value: "washing-machine",
  },
  {
    item: "Smartphone",
    value: "smartphone",
  },
  {
    item: "Refrigator",
    value: "refrigator",
  },
  {
    item: "Laptop",
    value: "laptop",
  },
  {
    item: "Television",
    value: "television",
  },
  {
    item: "Microwave",
    value: "microwave",
  },
];

export default function MerchantPage({ params }: { params: { slug: string } }) {
  const categoryParams = params.slug
    ?.toString()
    .replace(/%20/g, "-")
    .toLowerCase();

  return (
    <main className="wrapper py-20">
      <div className="flex justify-between">
        <SelectOption
          params={params}
          selectLabel="Service Category"
          categoryList={categoryList}
          defaultSelectValue={categoryParams}
        />

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
