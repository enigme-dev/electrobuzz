import { TGetMerchantBookingRejected } from "@/bookings/types";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
interface MerchantBookingRejectedProps {
  bookingDetailData: TGetMerchantBookingRejected;
}
const MerchantBookingRejected = ({
  bookingDetailData,
}: MerchantBookingRejectedProps) => {
  return (
    <div>
      <div>
        {" "}
        <div className="flex items-center justify-center ">
          <Image
            src={"/Discarded idea-cuate.svg"}
            width={500}
            height={500}
            alt={"Discarded idea-cuate"}
          />
        </div>
        <div className="grid gap-5 pt-10">
          <div className="grid place-items-center">
            <h1 className=" text-md text-white sm:text-2xl font-bold rounded-lg bg-red-500 p-3 w-fit ">
              Kamu sudah menolak orderan ini...
            </h1>{" "}
            <p className="text-lg pt-2 sm:text-md grid place-items-center">
              <span className="font-semibold text-sm sm:text-lg">
                Dengan alasan:{" "}
              </span>
              <p className="max-w-screen-lg text-wrap break-words text-sm sm:text-lg">
                {bookingDetailData.bookingReason}
              </p>
            </p>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg space-y-5">
            <h1 className="font-semibold text-md sm:text-xl text-center">
              Keluhan User
            </h1>
            <div>
              <h2 className="pt-2 text-left text-sm sm:text-lg">Keluhan:</h2>
              <p className=" text-left text-sm sm:text-md font-semibold">
                {bookingDetailData.bookingComplain}
              </p>
            </div>
            <div>
              <h2 className="pt-2 text-left text-sm sm:text-lg">Foto:</h2>
              <Image
                src={bookingDetailData.bookingPhotoUrl}
                alt={bookingDetailData.bookingPhotoUrl}
                className=" text-left text-sm sm:text-md font-semibold"
                width={200}
                height={200}
              />
            </div>
            <div>
              <h2 className="pt-2 text-left text-sm sm:text-lg">
                Tanggal Janji:
              </h2>
              <p className=" text-left text-sm sm:text-md font-semibold">
                {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg space-y-5">
            <h2 className="font-semibold text-md sm:text-xl  text-center">
              Respon Merchant
            </h2>
            <div>
              <p className="text-sm sm:text-lg text-left">Estimasi Harga:</p>
              <p className=" text-sm sm:text-md font-semibold text-left">
                Rp.700.000 - Rp.1000.000
              </p>
            </div>
            <div>
              <h1 className="text-left text-sm sm:text-lg">Deskripsi:</h1>
              <p className=" text-left text-sm sm:text-md font-semibold">
                Perlu ganti kapasitor sekitar 700.000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantBookingRejected;
