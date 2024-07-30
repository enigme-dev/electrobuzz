import {
  TBookingModel,
  TBookingReasonSchema,
  TGetUserBooking,
} from "@/bookings/types";
import { DialogGeneral } from "@/core/components/general-dialog";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { toast } from "@/core/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BookingStatus from "../bookingStatus";
import Modal from "@/core/components/modal";

interface UserBookingPendingProps {
  bookingDetailData: TGetUserBooking;
}

const radioOptionsForCancelReason = [
  { option: "Budjet tidak cukup", label: "Budjet tidak cukup" },
  { option: "Mau cari teknisi lain", label: "Mau cari teknisi lain" },
  { option: "Mau ubah jadwal", label: "Mau ubah jadwal" },
  { option: "", label: "Other" },
];

const UserBookingPending = ({ bookingDetailData }: UserBookingPendingProps) => {
  const [imageFullscreen, setImageFullscreen] = useState(false);

  const { mutate: updateCancelBooking, isPending: updateCancelBookingLoading } =
    useMutation({
      mutationFn: (values: TBookingReasonSchema) =>
        axios.patch(
          `/api/user/booking/${bookingDetailData.bookingId}/edit/cancel`,
          values
        ),
      onSuccess: () => {
        toast({
          title: "Kamu berhasil menolak order ini!",
        });
      },
      onError: () => {
        toast({
          title: "Kamu gagal menolak order ini!",
        });
      },
    });

  return (
    <div className="flex items-center justify-center mt-10 gap-10 lg:gap-20 flex-col lg:flex-row">
      {" "}
      <div className="flex flex-col gap-2 items-center">
        <Image
          src="/Conversation-cuate.svg"
          alt="bookDetailBanner"
          className=" w-[350px] "
          width={900}
          height={500}
        />
        <h1 className=" text-2xl font-bold text-center max-w-[300px]">
          Sabar, mohon menunggu konfirmasi merchant...
        </h1>
      </div>
      <div className="shadow-lg border p-5 rounded-lg space-y-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-md sm:text-xl ">Keluhan User</h1>
          <BookingStatus status="pending" />
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
        <div className="flex gap-10 justify-center items-center pt-10">
          <Link href={"/user/my-bookings"}>
            <Button variant={"outline"}>Kembali</Button>
          </Link>
          <DialogGeneral
            dialogTitle="Alasan Penolakan"
            dialogContent={
              <RadioGroupForm
                options={radioOptionsForCancelReason}
                onSubmitRadio={(value) => updateCancelBooking(value)}
                defaultValue={radioOptionsForCancelReason[0].option ?? ""}
                onSubmitLoading={updateCancelBookingLoading}
              />
            }
            dialogTrigger={<Button variant={"destructive"}>Batalkan</Button>}
          />
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

export default UserBookingPending;
