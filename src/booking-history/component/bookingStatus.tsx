import React from "react";
import { Card } from "../../core/components/ui/card";

interface Props {
  status: "Awaiting" | "Denied" | "Accepted" | "In Progress" | "Completed";
}

const BookingStatus = ({ status }: Props) => {
  return (
    <div>
      {" "}
      <div className=" flex justify-center items-center gap-2">
        {status === "Awaiting" && (
          <div className="h-1 w-1 rounded-full bg-gray-500"></div>
        )}
        {status === "Denied" && (
          <div className="h-1 w-1 rounded-full bg-red-500"></div>
        )}
        {status === "Accepted" && (
          <div className="h-1 w-1 rounded-full bg-blue-500"></div>
        )}
        {status === "In Progress" && (
          <div className="h-1 w-1 rounded-full bg-yellow-500"></div>
        )}
        {status === "Completed" && (
          <div className="h-1 w-1 rounded-full bg-green-500"></div>
        )}
        <p className="text-xs sm:text-md">{status}</p>
      </div>
    </div>
  );
};

export default BookingStatus;
