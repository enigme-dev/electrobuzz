import { TGetMerchantBookingCanceled } from "@/bookings/types";
import { Button } from "@/core/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MerchantBookingCanceledProps {
  bookingDetailData: TGetMerchantBookingCanceled;
}

const MerchantBookingCanceled = ({
  bookingDetailData,
}: MerchantBookingCanceledProps) => {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-center">
        <Image
          src="/Feeling sorry-cuate.svg"
          alt="Feeling sorry-cuate"
          className=" w-96 "
          width={900}
          height={500}
        />
      </div>
      <div className="grid  gap-5 w-fit wrapper">
        <h1 className=" text-2xl font-bold text-center">Maaf...</h1>
        <p className="pt-2 text-center text-lg">
          Permintaan anda telah ditolak oleh User
        </p>

        <div className="space-y-2">
          <p className="text-sm sm:text-xl text-center">Alasan Penolakan:</p>
          <p className=" text-sm sm:text-lg font-semibold text-center w-[60vw] break-words overflow-auto">
            {bookingDetailData.bookingReason}{" "}
          </p>
        </div>

        <div className="shadow-lg border p-5 rounded-lg space-y-5">
          <h1 className="font-semibold text-md sm:text-xl text-center">
            Keluhan User
          </h1>
          <div>
            <h2 className="pt-2 text-sm sm:text-xl text-center">
              Foto Keluhan:
            </h2>
            <div className="flex justify-center">
              <Image
                src={bookingDetailData.bookingPhotoUrl}
                alt={bookingDetailData.bookingPhotoUrl}
                className="pt-5"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div>
            <h2 className="pt-2 text-left text-sm sm:text-xl">Keluhan:</h2>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.bookingComplain}
            </p>
          </div>

          <div>
            <h2 className="pt-2 text-left text-sm sm:text-xl">
              Tanggal Janji:
            </h2>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
            </p>
          </div>
        </div>
        <Link
          className="flex justify-center"
          href={"/merchant/dashboard/transaction"}
        >
          <Button variant={"outline"}>Kembali</Button>
        </Link>
      </div>
    </div>
  );
};

export default MerchantBookingCanceled;
