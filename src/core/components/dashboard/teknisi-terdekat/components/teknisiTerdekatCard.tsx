import { Card } from "@/core/components/ui/card";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const TeknisiTerdekatCard: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Card className="p-6 w-full hover:shadow-lg cursor-pointer transition duration-500">
        {children}
      </Card>
    </div>
  );
};

export default TeknisiTerdekatCard;
