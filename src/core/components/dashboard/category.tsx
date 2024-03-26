import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  AirVentIcon,
  Laptop,
  MicrowaveIcon,
  RefrigeratorIcon,
  SmartphoneIcon,
  Tv,
  WashingMachineIcon,
} from "lucide-react";

const Category = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Kategori</h1>
      <div className="pt-10 w-full overflow-visible">
        <div className="flex flex-row gap-6  overflow-x-scroll">
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <AirVentIcon size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Air Conditioner</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer  transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <WashingMachineIcon size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Washing Machine</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer  transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <SmartphoneIcon size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Smartphone</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <RefrigeratorIcon size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Refrigator</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <Laptop size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Laptop</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer transition duration-500">
              <CardContent className="flex items-center justify-center p-6">
                <Tv size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Television</p>
          </div>
          <div className="grid place-items-center items-center gap-5">
            <Card className="hover:shadow-lg hover:shadow-yellow-200 cursor-pointer transition duration-300">
              <CardContent className="flex items-center justify-center p-6">
                <MicrowaveIcon size={100} strokeWidth={1} />
              </CardContent>
            </Card>
            <p>Microwave</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
