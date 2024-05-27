import {
  TBookingModel,
  TBookingReasonSchema,
  TGetUserBooking,
} from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
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

interface UserBookingAcceptProps {
  bookingDetailData: TGetUserBooking;
}

const radioOptionsForCancelReason = [
  { option: "Budjet tidak cukup", label: "Budjet tidak cukup" },
  { option: "Mau cari teknisi lain", label: "Mau cari teknisi lain" },
  { option: "Mau ubah jadwal", label: "Mau ubah jadwal" },
  { option: "", label: "Other" },
];

const UserBookingAccept = ({ bookingDetailData }: UserBookingAcceptProps) => {
  const { mutate: updateCancelBooking, isPending: updateCancelBookingLoading } =
    useMutation({
      mutationFn: (values: TBookingReasonSchema) =>
        axios.patch(
          `/api/merchant/booking/${bookingDetailData.bookingId}/edit/reject`,
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
        <div className="pb-5 flex justify-center">
          <h1 className="w-fit text-lg sm:text-xl font-bold text-center bg-green-500 text-white rounded-lg p-3">
            Selamat merchant telah menerima keluhanmu!
          </h1>
        </div>

        <div className="shadow-lg border border-gray-100 p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl text-center">
            Data Merchant
          </h2>
          <div>
            <p className="text-sm sm:text-xl text-left">Nama:</p>
            <p className=" text-sm sm:text-lg font-semibold text-left">
              {bookingDetailData.merchant.merchantName}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-xl">Nomor Telpon:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.merchant.user.phone}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.address.addressDetail},{" "}
              {bookingDetailData.address.addressCity},{" "}
              {bookingDetailData.address.addressProvince},{" "}
              {bookingDetailData.address.addressZipCode}
            </p>
          </div>
        </div>
        <div className="shadow-lg border border-gray-100 p-5 rounded-lg space-y-5">
          <h1 className="font-semibold text-md sm:text-xl text-center">
            Keluhan User
          </h1>
          <div>
            <h2 className="pt-2 text-center text-sm sm:text-xl">
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
        <div className="shadow-lg border border-gray-100 p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl  text-center">
            Respon Merchant
          </h2>
          <div>
            <p className="text-sm sm:text-xl text-left">Estimasi Harga:</p>
            <p className=" text-sm sm:text-lg font-semibold text-left">
              Rp.{bookingDetailData.bookingPriceMin} - Rp.
              {bookingDetailData.bookingPriceMax}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-xl">Deskripsi:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.bookingDesc}
            </p>
          </div>
        </div>
        <div className="flex gap-10 justify-center items-center pt-5">
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
    </div>
  );
};

export default UserBookingAccept;