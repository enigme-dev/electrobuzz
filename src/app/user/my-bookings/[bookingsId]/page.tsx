"use client";

import { BookStatusEnum, TBookingModel } from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const BookingDetail = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const radioOptionsForCancelReason = [
    { option: "Budjet tidak cukup" },
    { option: "Mau cari teknisi lain" },
    { option: "Mau ubah jadwal" },
    { option: "Other" },
  ];
  const getLastPathSegment = (pathname: string): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  const bookingId = getLastPathSegment(pathname);

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/user/booking/${bookingId}`).then((response) => {
        return response.data.data as TBookingModel;
      }),
    enabled: !!bookingId,
  });

  console.log(bookingDetailData);

  // const { mutate: AcceptBookings, isPending: addAddressLoading } =
  //   useMutation({
  //     mutationFn: async (values: TCreateBookingSchema) =>
  //       await axios.post(`/api/merchant/${}/book`, values),
  //     onSuccess: () => {
  //       toast({ title: "Keluhan anda telah terkirim!" });
  //       queryClient.invalidateQueries({
  //         queryKey: ["getBookAppointment", session?.user?.id],
  //       });
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Keluhan anda gagal terkirim!",
  //         variant: "destructive",
  //       });
  //     },
  //   });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <main className="sm:wrapper pb-20 px-4">
      {bookingDetailData?.bookingStatus == "pending" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Conversation-cuate.svg"
              alt="bookDetailBanner"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <h1 className="pt-10 text-2xl font-bold">Sabar...</h1>
            <p>Mohon menunggu konfirmasi Merchant</p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Keluhan:</h1>
            <p className="font-bold text-left text-sm sm:text-xl">
              {bookingDetailData.bookingComplain}
            </p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Foto:</h1>
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingPhotoUrl}
              className="font-bold text-left text-sm sm:text-xl"
              width={200}
              height={200}
            />
            <div className="flex gap-10 justify-center items-center">
              {/* <DialogGeneral
                dialogTitle="Alasan Penolakan"
                dialogContent={
                  <RadioGroupForm options={radioOptionsForCancelReason} />
                }
                dialogTrigger={<Button variant={"destructive"}>Cancel</Button>}
              /> */}
              <Link href={"/user/my-bookings"}>
                <Button>Kembali</Button>
              </Link>
            </div>
          </div>
        </>
      )}
      {bookingDetailData?.bookingStatus == "rejected" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Feeling sorry-cuate.svg"
              alt="Feeling sorry-cuate"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <div>
              <h1 className="pt-10 text-2xl font-bold">Maaf...</h1>
              <p className="pt-2">Permintaan anda telah ditolak oleh Mitra</p>
              <h1 className="pt-2 text-left text-md">Alasan:</h1>
              <p className="font-bold">{bookingDetailData.bookingReason}</p>
            </div>
            <Link href={"/user/my-bookings"}>
              <Button>Kembali</Button>
            </Link>
          </div>
        </>
      )}
      {bookingDetailData?.bookingStatus == "accepted" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Light bulb-cuate.svg"
              alt="bookDetailBanner"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <h1 className="sm:pt-10 text-lg sm:text-2xl font-bold">
              Selamat...
            </h1>
            <p className="text-sm sm:text-lg text-left">
              Sepertinya Mitra telah menerima permintaanmu, berikut merupakan
              estimasi harga servismu:
            </p>
            <p className="font-bold text-sm sm:text-xl ">
              Rp {bookingDetailData.bookingPriceMin} - Rp{" "}
              {bookingDetailData.bookingPriceMax}
            </p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Alasan:</h1>
            <p className="font-bold text-left text-sm sm:text-xl">
              {bookingDetailData.bookingDesc}
            </p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Keluhan:</h1>
            <p className="font-bold text-left text-sm sm:text-xl">
              {bookingDetailData.bookingComplain}
            </p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Foto:</h1>
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingPhotoUrl}
              className="font-bold text-left text-sm sm:text-xl"
              width={200}
              height={200}
            />
            <div className="flex gap-10 justify-center items-center">
              {/* <DialogGeneral
                dialogTitle="Alasan Penolakan"
                dialogContent={
                  <RadioGroupForm defaultValue="" options={radioOptionsForCancelReason} />
                }
                dialogTrigger={<Button variant={"destructive"}>Cancel</Button>}
              /> */}
              <AlertDialogComponent
                dialogTitle="Apakah kamu yakin?"
                alertDialogSubmitTitle="submit"
                dialogDescription="Pastikan kamu memiliki budget yang cukup ya..."
                submitAction={() => {}}
                dialogTrigger={<Button variant={"outline"}>Terima</Button>}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default BookingDetail;
