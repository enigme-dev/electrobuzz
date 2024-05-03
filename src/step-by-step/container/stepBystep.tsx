import React from "react";
import { Separator } from "../../core/components/ui/separator";
import StepperCard from "../component/stepperCard";
import {
  CameraIcon,
  HeartHandshake,
  SearchCheckIcon,
  SearchIcon,
} from "lucide-react";

const StepByStep = () => {
  return (
    <div className="hidden lg:block">
      <div className="z-0">
        <Separator />
      </div>
      <div className="flex w-full  justify-between  mt-[-18px]">
        <div className="grid gap-5 items-center place-items-center">
          <div className="z-10 w-10 h-10 border rounded-full flex items-center justify-center bg-white dark:bg-[#020817]">
            1
          </div>
          <StepperCard>
            <div className="grid items-center place-items-center gap-5">
              <SearchIcon />
              <h3 className="font-semibold text-lg">Cari teknisi favoritmu</h3>
            </div>
          </StepperCard>
        </div>
        <div className="grid gap-5 items-center place-items-center">
          <div className="z-10 w-10 h-10 border rounded-full flex items-center justify-center bg-white dark:bg-[#020817]">
            2
          </div>
          <StepperCard>
            <div className="grid items-center place-items-center gap-5">
              <CameraIcon />
              <h3 className="font-semibold text-lg">Deskripsikan keluhanmu</h3>
            </div>
          </StepperCard>
        </div>
        <div className="grid gap-5 items-center place-items-center">
          <div className="z-10 w-10 h-10 border rounded-full flex items-center justify-center bg-white dark:bg-[#020817]">
            3
          </div>
          <StepperCard>
            <div className="grid items-center place-items-center gap-5">
              <HeartHandshake />
              <h3 className="font-semibold text-lg">Buat janji temu</h3>
            </div>
          </StepperCard>
        </div>
      </div>
    </div>
  );
};

export default StepByStep;
