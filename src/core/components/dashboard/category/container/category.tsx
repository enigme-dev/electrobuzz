import React, { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import {
  AirVentIcon,
  Laptop,
  MicrowaveIcon,
  RefrigeratorIcon,
  SmartphoneIcon,
  Tv,
  WashingMachineIcon,
} from "lucide-react";
import CategoryCard from "../components/categoryCard";

const Category = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Kategori</h1>
      <div className="pt-10 w-full overflow-visible">
        <div className="flex flex-row gap-6  overflow-x-scroll">
          <CategoryCard
            categoryIcon={<AirVentIcon size={100} strokeWidth={1} />}
            categoryName="Air Conditioner"
          />
          <CategoryCard
            categoryIcon={<WashingMachineIcon size={100} strokeWidth={1} />}
            categoryName="Washing Machine"
          />
          <CategoryCard
            categoryIcon={<SmartphoneIcon size={100} strokeWidth={1} />}
            categoryName="Smartphone"
          />
          <CategoryCard
            categoryIcon={<RefrigeratorIcon size={100} strokeWidth={1} />}
            categoryName="Refrigator"
          />
          <CategoryCard
            categoryIcon={<Laptop size={100} strokeWidth={1} />}
            categoryName="Laptop"
          />
          <CategoryCard
            categoryIcon={<Tv size={100} strokeWidth={1} />}
            categoryName="Television"
          />
          <CategoryCard
            categoryIcon={<MicrowaveIcon size={100} strokeWidth={1} />}
            categoryName="Microwave"
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
