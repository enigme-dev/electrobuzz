import { useState } from "react";
import { Separator } from "./ui/separator";

interface StepperProps {
  activeStep: Number;
  labels: string[];
}

export default function Stepper(props: StepperProps) {
  return (
    <div className="pb-10">
      <Separator />
      <div className="flex gap-10 pt-2">
        {props.labels.map((label, i) =>
          i === props.activeStep ? (
            <span className="text-xs sm:text-sm text-center" key={label}>
              {label}
            </span>
          ) : (
            <span
              key={label}
              className="text-xs sm:text-sm text-gray-400 text-center"
            >
              {label}
            </span>
          )
        )}
      </div>
    </div>
  );
}
