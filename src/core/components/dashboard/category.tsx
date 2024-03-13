import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

const Category = () => {
  return (
    <div className="">
      <h1 className="text-2xl">Kategori</h1>
      <div className="pt-10 w-full grid grid-cols-8 gap-6">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold"></span>
            <h1>AC</h1>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Category;
