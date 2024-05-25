"use client";

import {
  BookingReasonSchema,
  BookStatusEnum,
  TBookingModel,
  TBookingReasonSchema,
  TGetMerchantBookingPending,
} from "@/bookings/types";
import { AlertDialogComponent } from "@/core/components/alert-dialog";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { RadioGroupForm } from "@/core/components/radio-group";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { useToast } from "@/core/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const MerchantDashboardTransactionDetail = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const radioOptionsForCancelReason = [
    { option: "Budjet tidak cukup" },
    { option: "Mau cari teknisi lain" },
    { option: "Mau ubah jadwal" },
    { option: "Other" },
  ];
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const { data: bookingDetailData, isLoading } = useQuery({
    queryKey: ["getBookingDetailData", bookingId],
    queryFn: async () =>
      await axios.get(`/api/merchant/booking/${bookingId}`).then((response) => {
        return response.data.data as TGetMerchantBookingPending;
      }),
    enabled: !!bookingId,
  });
  const form = useForm<TBookingReasonSchema>({
    resolver: zodResolver(BookingReasonSchema),
  });

  const { mutate: updateBookingReason, isPending: updateBookingReasonLoading } =
    useMutation({
      mutationFn: (values: TBookingReasonSchema) =>
        axios.patch(`/api/merchant/booking/${bookingId}/edit/reject`, values),
      onSuccess: () => {
        toast({
          title: "Tolak berhasil!",
        });
      },
      onError: (error) => {
        toast({
          title: "Tolak gagal!",
        });
      },
    });

  function onSubmit(values: TBookingReasonSchema) {
    updateBookingReason(values);
  }

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
    <main className="pb-20 px-8 max-h-screen no-scrollbar overflow-scroll max-w-screen">
      {bookingDetailData?.bookingStatus == "pending" && (
        <>
          <div className="grid place-content-center text-center gap-5">
            <div className="pt-10 ">
              <h1 className="text-2xl font-bold text-white bg-green-500 px-3 py-2 rounded-lg">
                Kamu mendapatkan order!
              </h1>
            </div>
          </div>
          <div className="space-y-5">
            <div className="mt-10 ">
              <h1 className="font-bold text-xl">Data Pelanggan:</h1>
              <h1 className="mt-4 text-left text-sm sm:text-lg ">Nama:</h1>
              <p className="font-semibold text-left text-sm sm:text-lg">
                {bookingDetailData.user.name}
              </p>
            </div>
            <div>
              <h1 className=" text-left text-sm sm:text-lg ">Alamat:</h1>
              <p className="font-semibold text-left text-sm sm:text-lg">
                {bookingDetailData.address.addressDetail},{" "}
                {bookingDetailData.address.addressCity},{" "}
                {bookingDetailData.address.addressProvince},{" "}
                {bookingDetailData.address.addressZipCode}
              </p>
            </div>
            <div className="pt-10">
              <h1 className="font-bold text-xl">Deskripsi Keluhan:</h1>
              <h1 className="mt-4 text-left text-sm sm:text-lg ">Keluhan:</h1>
              <p className="font-semibold text-left text-sm sm:text-lg">
                {bookingDetailData.bookingComplain}
              </p>
            </div>
            <div>
              <h1 className=" text-left text-sm sm:text-lg ">Foto Keluhan:</h1>
              <Image
                src={bookingDetailData.bookingPhotoUrl}
                alt={bookingDetailData.bookingPhotoUrl}
                className="font-semibold text-left text-sm sm:text-lg py-4"
                width={200}
                height={200}
              />
            </div>
            <div>
              <h1 className=" text-left text-sm sm:text-lg ">
                Permohonan tanggal janji:
              </h1>
              <p className="font-semibold text-left text-sm sm:text-lg">
                {format(bookingDetailData.bookingSchedule, "PPP")}
              </p>
            </div>
          </div>
          <div className="flex gap-10 justify-center items-center pt-5">
            <DialogGeneral
              dialogTitle="Alasan Penolakan"
              dialogContent={
                // <RadioGroupForm options={radioOptionsForCancelReason} />
                <>
                  <Form {...form}>
                    <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="bookingReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alasan</FormLabel>
                            <FormControl>
                              <Input placeholder="Jadwal penuh..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="w-full flex justify-end items-center pt-5">
                        <ButtonWithLoader
                          isLoading={updateBookingReasonLoading}
                          className=""
                          buttonText="Tolak"
                          variant={"destructive"}
                          type="submit"
                        />
                      </div>
                    </form>
                  </Form>
                </>
              }
              dialogTrigger={<Button variant={"destructive"}>Cancel</Button>}
            />
            <DialogGeneral
              dialogTitle="Masukan estimasi harga dan alasan"
              dialogContent={
                <></>
                // <div>
                //   <Form {...form}>
                //     <form onSubmit={form.handleSubmit(onSubmit)}>
                //       <FormField
                //         control={form.control}
                //         name="merchantName"
                //         render={({ field }) => (
                //           <FormItem>
                //             <FormLabel>Estimasi Harga</FormLabel>
                //             <FormControl>
                //               <Input
                //                 type="number"
                //                 placeholder="Nama tokomu"
                //                 {...field}
                //               />
                //             </FormControl>
                //             <FormMessage />
                //           </FormItem>
                //         )}
                //       />
                //       <FormField
                //         control={form.control}
                //         name="merchantName"
                //         render={({ field }) => (
                //           <FormItem>
                //             <FormLabel>Alasan</FormLabel>
                //             <FormControl>
                //               <Input
                //                 placeholder="Harus ganti kapasitor sebesar RP 500.000"
                //                 {...field}
                //               />
                //             </FormControl>
                //             <FormMessage />
                //           </FormItem>
                //         )}
                //       />
                //     </form>
                //   </Form>
                // </div>
              }
              dialogTrigger={<Button variant={"outline"}>Terima</Button>}
            />
          </div>
        </>
      )}
      {bookingDetailData?.bookingStatus == "canceled" && (
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
              {/* <p className="font-bold">{bookingDetailData}</p> */}
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
              Rp.700.000 - Rp.1000.000
            </p>
            <h1 className="pt-2 text-left text-sm sm:text-lg">Alasan:</h1>
            <p className="font-bold text-left text-sm sm:text-xl">
              Perlu ganti kapasitor sekitar 700.000
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
              <DialogGeneral
                dialogTitle="Alasan Penolakan"
                dialogContent={
                  <RadioGroupForm options={radioOptionsForCancelReason} />
                }
                dialogTrigger={<Button variant={"destructive"}>Cancel</Button>}
              />
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

export default MerchantDashboardTransactionDetail;
