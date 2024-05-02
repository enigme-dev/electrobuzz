import { Card } from "@/core/components/ui/card";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const StepperCard: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Card className="p-6 w-72">{children}</Card>
    </div>
  );
};

export default StepperCard;
