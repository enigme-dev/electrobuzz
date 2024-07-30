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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";

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
        <span className="text-2xl"> 💡</span> Kategori
      </h1>

      <Carousel className="w-full mt-10">
        <CarouselContent className="-ml-1">
          {CategoryData.map((item, index) => (
            <CarouselItem key={index} className="basis-[25%] py-2 lg:basis-1/6">
              <CategoryCard
                categoryIcon={item.categoryIcon}
                categoryName={item.categoryName}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>

      <div className="w-full flex justify-center ">
        <MoveHorizontal strokeWidth={1} className="text-gray-400 lg:hidden" />
      </div>
    </div>
  );
};

export default Category;
