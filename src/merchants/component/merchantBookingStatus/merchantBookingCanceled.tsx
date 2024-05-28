import { TGetMerchantBookingCanceled } from "@/bookings/types";
import { Button } from "@/core/components/ui/button";
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
      <div className="grid place-items-center gap-5 w-fit wrapper">
        <h1 className=" text-2xl font-bold text-center">Maaf...</h1>
        <p className="pt-2 text-center text-lg">
          Permintaan anda telah ditolak oleh User
        </p>
        <div className="shadow-lg border-gray-100 border rounded-lg p-5 grid place-items-center">
          <div className="space-y-2">
            <p className="text-sm sm:text-xl text-center">Alasan Penolakan:</p>
            <p className=" text-sm sm:text-lg font-semibold text-center w-[60vw] break-words overflow-auto">
              {bookingDetailData.bookingReason}{" "}
            </p>
          </div>
        </div>
        <Link
          className="flex justify-center"
          href={"/merchant/dashboard/transaction"}
        >
          <Button>Kembali</Button>
        </Link>
      </div>
    </div>
  );
};

export default MerchantBookingCanceled;
