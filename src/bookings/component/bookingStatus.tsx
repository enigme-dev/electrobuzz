import React from "react";
import { Card } from "../../core/components/ui/card";
import { BookStatusEnum } from "@/bookings/types";

interface Props {
  status?: BookStatusEnum;
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
        {status === "canceled" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-red-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Canceled</p>
          </div>
        )}
        {status === "rejected" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-red-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Rejected</p>
          </div>
        )}
        {status === "in_progress_requested" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-orange-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Requested</p>
          </div>
        )}
        {status === "expired" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-yellow-500">
            {" "}
            <p className="text-xs sm:text-md text-white">Expired</p>
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
