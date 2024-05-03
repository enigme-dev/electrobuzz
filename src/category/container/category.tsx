import React, { useState } from "react";
import { Card, CardContent } from "../../core/components/ui/card";
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
      <h1 className="text-xl sm:text-2xl font-bold">Kategori</h1>
      <div className="pt-10 w-full overflow-visible">
        <div className="flex flex-row gap-6  overflow-x-scroll pb-4">
          <CategoryCard
            categoryIcon={
              <AirVentIcon
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="AC"
          />
          <CategoryCard
            categoryIcon={
              <WashingMachineIcon
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Mesin Cuci"
          />
          <CategoryCard
            categoryIcon={
              <SmartphoneIcon
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Smartphone"
          />
          <CategoryCard
            categoryIcon={
              <RefrigeratorIcon
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Kulkas"
          />
          <CategoryCard
            categoryIcon={
              <Laptop
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Laptop"
          />
          <CategoryCard
            categoryIcon={
              <Tv
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Televisi"
          />
          <CategoryCard
            categoryIcon={
              <MicrowaveIcon
                className="w-[30px] h-[30px] sm:w-[100px] sm:h-[100px]"
                size={100}
                strokeWidth={1}
              />
            }
            categoryName="Microwave"
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
