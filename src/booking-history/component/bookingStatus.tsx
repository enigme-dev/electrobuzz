import React from "react";
import { Card } from "../../core/components/ui/card";

interface Props {
  status: "pending" | "cancelled" | "accepted" | "done";
}

const BookingStatus = ({ status }: Props) => {
  return (
    <div>
      {" "}
      <div className=" flex justify-center items-center gap-2">
        {status === "pending" && (
          <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-full bg-gray-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Pending</p>
          </div>
        )}
        {status === "cancelled" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-red-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Cancelled</p>
          </div>
        )}
        {status === "accepted" && (
          <div className="  rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-blue-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Accepted</p>
          </div>
        )}
        {status === "done" && (
          <div className="  rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-green-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Done</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;
