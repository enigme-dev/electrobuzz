import { TGetMerchantBookingAccepted } from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import { DialogGeneral } from "@/core/components/general-dialog";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

interface MerchantBookingAcceptedProps {
  bookingDetailData: TGetMerchantBookingAccepted;
}

const MerchantBookingAccepted = ({
  bookingDetailData,
}: MerchantBookingAcceptedProps) => {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-center">
        <Image
          src="/Light bulb-cuate.svg"
          alt="bookDetailBanner"
          className=" w-96 "
          width={900}
          height={500}
        />
      </div>
      <div className="grid gap-5">
        <h1 className="sm:pt-10 text-lg sm:text-2xl font-bold text-center">
          Kamu sudah menerima orderan ini...
        </h1>
        <p className="text-xs text-red-400 italic text-center">
          *Mohon segera melakukan pengecekan pada tanggal yang dicantumkan, Jika
          tidak maka akan ada tenggang waktu pada order ini selama 1 hari
          setelah hari perjanjian.
        </p>
        <div className="bg-gray-100 p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl text-center">
            Data User
          </h2>
          <div>
            <p className="text-sm sm:text-lg text-left">Nama:</p>
            <p className=" text-sm sm:text-md font-semibold text-left">
              {bookingDetailData.user.name}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-lg">Nomor Telpon:</h1>
            <p className=" text-left text-sm sm:text-md font-semibold">
              {bookingDetailData.user.phone}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-lg">Alamat:</h1>
            <p className=" text-left text-sm sm:text-md font-semibold">
              {bookingDetailData.address.addressDetail},{" "}
              {bookingDetailData.address.addressCity},{" "}
              {bookingDetailData.address.addressProvince},{" "}
              {bookingDetailData.address.addressZipCode}
            </p>
          </div>
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
  );
};

export default MerchantBookingAccepted;
