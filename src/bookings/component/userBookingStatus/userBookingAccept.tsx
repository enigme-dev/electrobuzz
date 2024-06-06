import {
  TBookingModel,
  TBookingReasonSchema,
  TGetUserBooking,
} from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { toast } from "@/core/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UserBookingAcceptProps {
  bookingDetailData: TGetUserBooking;
}
interface BookingCode {
  status: string;
  data: {
    code: string;
    expiredAt: Date;
  };
}
const radioOptionsForCancelReason = [
  { option: "Budjet tidak cukup", label: "Budjet tidak cukup" },
  { option: "Mau cari teknisi lain", label: "Mau cari teknisi lain" },
  { option: "Mau ubah jadwal", label: "Mau ubah jadwal" },
  { option: "", label: "Other" },
];

const UserBookingAccept = ({ bookingDetailData }: UserBookingAcceptProps) => {
  const queryClient = useQueryClient();

  const [bookingCode, setBookingCode] = useState<BookingCode>({
    status: "",
    data: { code: "", expiredAt: new Date() },
  });

  const { mutate: updateCancelBooking, isPending: updateCancelBookingLoading } =
    useMutation({
      mutationFn: (values: TBookingReasonSchema) =>
        axios.patch(
          `/api/user/booking/${bookingDetailData.bookingId}/edit/cancel`,
          values
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getDetailBookingData", bookingDetailData.bookingId],
        });
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
  const {
    mutate: updateBookingToInProgress,
    isPending: updateBookingToInProgressLoading,
  } = useMutation({
    mutationFn: () =>
      axios.patch(
        `/api/user/booking/${bookingDetailData.bookingId}/edit/in_progress`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDetailBookingData", bookingDetailData.bookingId],
      });
      toast({
        title: "Kamu berhasil update booking ini!",
      });
    },
    onError: () => {
      toast({
        title: "Kamu gagal update booking ini!",
      });
    },
  });

  const getBookingCode = async () => {
    await axios
      .get(`/api/user/booking/${bookingDetailData.bookingId}/code`)
      .then((response) => {
        setBookingCode(response.data as BookingCode);
      })
      .catch((error) => {
        if (error.response.data.status === "ErrBookWrongSchedule") {
          toast({
            title: "Kode hanya bisa diberikan pada saat tanggal janji!",
            variant: "destructive",
          });
        }
      });
  };

  if (updateBookingToInProgressLoading) {
    return <Loader />;
  }

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
          <h1 className="w-fit text-lg sm:text-xl font-bold text-center  rounded-lg p-3">
            Selamat mitra telah menerima keluhanmu!
          </h1>
        </div>
        <div className="flex justify-center">
          <Button
            className="bg-yellow-400 text-black hover:bg-yellow-300"
            onClick={() => getBookingCode()}
          >
            Dapatkan Kode
          </Button>
        </div>
        <div className="grid place-items-center">
          <h1>Kode Bookingmu:</h1>
          <span className="text-2xl font-bold">
            {bookingCode ? bookingCode?.data.code : ""}
          </span>
          <span>{/* Expired pada {bookingCode ? } */}</span>
          <p className=" text-sm sm:text-lg text-red-500 italic text-center pt-5">
            *Mohon jangan berikan kode ini kepada mitra jika mitra belum mulai
            mengerjakan!
          </p>
          <p className=" text-sm sm:text-lg text-red-500 italic text-center pt-5">
            *Merchant akan datang pada tanggal yang dijanjikan ke alamatmu,
            mohon konfirmasi lebih lanjut melalui nomor dibawah ini.
          </p>
        </div>

        <div className="shadow-lg border p-5 rounded-lg space-y-5">
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
        </div>
        <div className="shadow-lg border p-5 rounded-lg space-y-5">
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
          <div>
            <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.addressDetail}, {bookingDetailData.addressCity}
              , {bookingDetailData.addressProvince},{" "}
              {bookingDetailData.addressZipCode}
            </p>
          </div>
        </div>
        <div className="shadow-lg border p-5 rounded-lg space-y-5">
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
      {/* {bookingDetailData.bookingStatus === "in_progress_requested" && (
        <AlertDialogComponent
          alertDialogSubmitTitle="Ya"
          defaultOpen={true}
          dialogDescription="Apakah benar service sedang berjalan? (tekan kembali jika service sedang tidak berjalan)"
          dialogTitle=""
          submitAction={updateBookingToInProgress}
        />
      )} */}
    </div>
  );
};

export default UserBookingAccept;
