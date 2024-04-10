import React from "react";
import { Card } from "../ui/card";

interface Props {
  status: "online" | "offline";
}

const StatusMerchant = ({ status }: Props) => {
  return (
    <div>
      {" "}
      <Card className=" px-4 py-2 flex justify-center items-center gap-2">
        {status === "online" && (
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        )}
        {status === "offline" && (
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
        )}
        {status}
      </Card>
    </div>
  );
};

export default StatusMerchant;
