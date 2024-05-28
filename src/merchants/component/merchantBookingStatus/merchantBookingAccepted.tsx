import { TBookingModel, TGetMerchantBookingAccepted } from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { DialogGeneral } from "@/core/components/general-dialog";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { useToast } from "@/core/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

interface MerchantBookingAcceptedProps {
  bookingDetailData: TGetMerchantBookingAccepted;
}

const MerchantBookingAccepted = ({
  bookingDetailData,
}: MerchantBookingAcceptedProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    mutate: updateRequestInProgressBooking,
    isPending: updateRequestInProgressBookingLoading,
  } = useMutation({
    mutationFn: () =>
      axios.patch(
        `/api/merchant/booking/${bookingDetailData.bookingId}/edit/in_progress`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getBookingDetailData", bookingDetailData.bookingId],
      });
      toast({
        title: "Berhasil request mulai mengerjakan!",
      });
    },
    onError: (error: any) => {
      if (error.response.data.status === "ErrBookWrongSchedule") {
        toast({
          title:
            "Kamu hanya bisa request 'mulai mengerjakan' disaat waktu pengerjaan!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Gagal request mulai mengerjakan!",
          variant: "destructive",
        });
      }
    },
  });
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
      <div className="grid gap-8">
        <h1 className="sm:pt-10 text-lg sm:text-2xl font-bold text-center">
          Kamu sudah menerima orderan ini...
        </h1>
        <div className=" flex justify-center">
          <ButtonWithLoader
            buttonText="Mulai Mengerjakan"
            className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
            isLoading={false}
            type="button"
            onClick={() => updateRequestInProgressBooking()}
          />
        </div>
        <p className="text-xs text-red-400 italic text-center">
          *Tekan tombol &quot;Mulai Mengerjakan&quot; jika kamu sudah memulai
          service.
        </p>
        <p className="text-xs text-red-400 italic text-center">
          *Mohon segera melakukan pengecekan pada tanggal yang dicantumkan, Jika
          tidak maka akan ada tenggang waktu pada order ini selama 1 hari
          setelah hari perjanjian.
        </p>
        <div className="shadow-lg border p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl text-center">
            Data User
          </h2>
          <div>
            <p className="text-sm sm:text-xl text-left">Nama:</p>
            <p className=" text-sm sm:text-lg font-semibold text-left break-words overflow-auto">
              {bookingDetailData.user.name}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-xl">Nomor Telpon:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold">
              {bookingDetailData.user.phone}
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
        <div className="shadow-xl border p-5 rounded-lg space-y-5">
          <h1 className="font-semibold text-lg sm:text-xl text-center">
            Keluhan Pengguna
          </h1>
          <div>
            <h2 className="pt-2 text-sm sm:text-xl text-center">
              Foto Keluhan:
            </h2>
            <div className="flex justify-center">
              <Image
                src={bookingDetailData.bookingPhotoUrl}
                alt={bookingDetailData.bookingPhotoUrl}
                className="p-3"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div>
            <h2 className="pt-2 text-left text-sm sm:text-xl">Keluhan:</h2>
            <p className=" text-left text-sm sm:text-lg font-semibold break-words overflow-auto">
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
        <div className="shadow-lg border p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl  text-center">
            Respon Merchant
          </h2>
          <div>
            <p className="text-sm sm:text-xl text-left">Estimasi Harga:</p>
            <p className=" text-sm sm:text-lg font-semibold text-left">
              Rp{bookingDetailData.bookingPriceMin} - Rp
              {bookingDetailData.bookingPriceMax}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-xl">Deskripsi:</h1>
            <p className=" text-left text-sm sm:text-lg font-semibold break-words overflow-auto">
              {bookingDetailData.bookingDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantBookingAccepted;
