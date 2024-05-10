import { useState, useEffect, ReactNode } from "react";

type StepComponent = () => JSX.Element;

interface StepNavigation {
  step: number;
  view: JSX.Element;
  handlePrev: () => void;
  handleNext: () => void;
}

const useStepNavigation = (
  initialStep: number,
  steps: StepComponent[]
): StepNavigation => {
  const [step, setStep] = useState(initialStep);
  const [view, setView] = useState(steps[initialStep]());

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep((prev) => prev + 1);
  };

  useEffect(() => {
    setView(steps[step]());
  }, [step, steps]);

  return { step, view, handlePrev, handleNext };
};

export default useStepNavigation;
