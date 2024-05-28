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
import React from "react";

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
    <div className="wrapper">
      {" "}
      <div className="flex items-center justify-center">
        <Image
          src="/Conversation-cuate.svg"
          alt="bookDetailBanner"
          className=" w-96 "
          width={900}
          height={500}
        />
      </div>
      <h2 className="font-semibold text-md sm:text-xl  text-center mb-5">
        Sabar, mohon menunggu konfirmasi merchant...
      </h2>
      <div className="shadow-lg border border-gray-100 p-5 rounded-lg space-y-5">
        <div className="space-y-2 ">
          <h1 className="text-center text-sm sm:text-xl">Foto keluhanmu:</h1>
          <div className="flex justify-center">
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingComplain}
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm sm:text-xl text-left">Keluhanmu:</p>
          <p className=" text-sm sm:text-lg font-semibold text-left break-words overflow-auto">
            {bookingDetailData.bookingComplain}
          </p>
        </div>

        <div className="space-y-2">
          <h1 className="text-left text-sm sm:text-xl">Tanggal Janji:</h1>
          <p className=" text-sm sm:text-lg font-semibold text-left">
            {format(bookingDetailData.bookingSchedule, "PPP")}
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
          dialogTrigger={<Button variant={"destructive"}>Cancel</Button>}
        />
      </div>
    </div>
  );
};

export default UserBookingPending;
