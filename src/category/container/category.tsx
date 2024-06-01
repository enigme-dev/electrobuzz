import React, { useState } from "react";
import { Card, CardContent } from "../../core/components/ui/card";
import {
  AirVentIcon,
  ArrowLeft,
  ArrowLeftRightIcon,
  Laptop,
  MicrowaveIcon,
  MoveHorizontal,
  RefrigeratorIcon,
  SmartphoneIcon,
  Tv,
  WashingMachineIcon,
} from "lucide-react";
import CategoryCard from "../components/categoryCard";

const CategoryData = [
  {
    categoryName: "AC",
    categoryIcon: (
      <AirVentIcon
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "Mesin Cuci",
    categoryIcon: (
      <WashingMachineIcon
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "Smartphone",
    categoryIcon: (
      <SmartphoneIcon
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "Kulkas",
    categoryIcon: (
      <RefrigeratorIcon
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "Laptop",
    categoryIcon: (
      <Laptop
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "TV",
    categoryIcon: (
      <Tv
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
  {
    categoryName: "Microwave",
    categoryIcon: (
      <MicrowaveIcon
        className="w-[30px] h-[30px] sm:w-[90px] sm:h-[90px]"
        size={100}
        strokeWidth={1}
      />
    ),
  },
];

const Category = () => {
  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        Kategori <span className="text-2xl"> 💡</span>
      </h1>
      <div className="pt-10 w-full overflow-visible">
        <div className="flex flex-row gap-6  overflow-x-scroll pb-4 no-scrollbar">
          {CategoryData.map((item, index) => (
            <div key={index}>
              <CategoryCard
                categoryIcon={item.categoryIcon}
                categoryName={item.categoryName}
              />
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center ">
          <MoveHorizontal strokeWidth={1} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Category;
