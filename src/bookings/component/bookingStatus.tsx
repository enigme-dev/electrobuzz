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
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Menunggu konfimasi
            </p>
          </div>
        )}
        {status === "canceled" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-red-700/90">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Dibatalkan pengguna
            </p>
          </div>
        )}
        {status === "rejected" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-red-500">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Ditolak mitra
            </p>
          </div>
        )}

        {status === "in_progress" && (
          <div className="rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-blue-400">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white ">
              Proses servis
            </p>
          </div>
        )}
        {status === "expired" && (
          <div className=" rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-gray-700/90">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Kadaluwarsa
            </p>
          </div>
        )}
        {status === "accepted" && (
          <div className="  rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-blue-500">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Diterima mitra
            </p>
          </div>
        )}
        {status === "done" && (
          <div className="  rounded-full px-2 py-1 sm:px-3 sm:py-2 bg-green-500">
            {" "}
            <p className="text-[0.7rem] font-semibold sm:text-md text-white">
              Selesai
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;
