import {
  TBookingReasonSchema,
  TGetUserBookingRejected,
} from "@/bookings/types";
import { Button } from "@/core/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BookingStatus from "../bookingStatus";
import Modal from "@/core/components/modal";
import { EyeIcon } from "lucide-react";

interface UserBookingRejectProps {
  bookingDetailData: TGetUserBookingRejected;
}

const UserBookingReject = ({ bookingDetailData }: UserBookingRejectProps) => {
  const [imageFullscreen, setImageFullscreen] = useState(false);
  return (
    <div className="flex items-center justify-center mt-10 gap-10 lg:gap-20 flex-col lg:flex-row">
      {" "}
      <div className="">
        <Image
          src="/Feeling sorry-cuate.svg"
          alt="Feeling sorry-cuate"
          className=" w-[300px] "
          width={900}
          height={500}
        />{" "}
        <div className="grid gap-5 w-fit wrapper border shadow-lg p-4 rounded-lg overflow-auto max-h-[250px]">
          <h1 className=" text-2xl font-bold text-center">Maaf...</h1>
          <p className="pt-2 text-center text-lg">
            Permintaan anda telah ditolak oleh Mitra
          </p>
          <div className="grid place-items-center ">
            <p className="text-lg pt-2 sm:text-md grid place-items-center">
              <span className="font-semibold text-sm sm:text-lg">
                Dengan alasan:{" "}
              </span>
              <p className="max-w-[300px] text-wrap break-words text-sm sm:text-lg pt-2">
                {bookingDetailData.bookingReason}
              </p>
            </p>
          </div>
        </div>
      </div>
      <div className="shadow-lg border p-5 rounded-lg space-y-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-md sm:text-xl ">Keluhan User</h1>
          <BookingStatus status="rejected" />
        </div>
        <div>
          <h2 className="pt-2 text-sm sm:text-xl">Foto Keluhan:</h2>
          <div
            onClick={() => setImageFullscreen(true)}
            className="flex justify-center max-w-[200px] max-h-[200px] relative group pt-5 hover:opacity-50 cursor-pointer"
          >
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingPhotoUrl}
              className=""
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
          <h2 className="pt-2 text-left text-sm sm:text-xl">Tanggal Janji:</h2>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
          </p>
        </div>
        <div>
          <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {bookingDetailData.addressDetail}, {bookingDetailData.addressCity},{" "}
            {bookingDetailData.addressProvince},{" "}
            {bookingDetailData.addressZipCode}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href={"/user/my-bookings"}>
            <Button variant={"outline"}>Kembali</Button>
          </Link>
        </div>
      </div>
      <div>
        <Modal
          imageUrl={bookingDetailData.bookingPhotoUrl}
          setShowModal={setImageFullscreen}
          showModal={imageFullscreen}
        />
      </div>
    </div>
  );
};

export default UserBookingReject;
