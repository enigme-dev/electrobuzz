import {
  AcceptBookingSchema,
  BookingReasonSchema,
  TAcceptBookingSchema,
  TBookingReasonSchema,
  TGetMerchantBookingPending,
} from "@/bookings/types";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { DialogGeneral } from "@/core/components/general-dialog";
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
import { toast } from "@/core/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

interface MerchantBookingPendingProps {
  bookingDetailData: TGetMerchantBookingPending;
}

const radioOptionsForRejectReason = [
  { option: "Jadwal penuh", label: "Jadwal penuh" },
  { option: "Tidak bisa diservis", label: "Tidak bisa diservis" },
  { option: "Resiko terlalu besar", label: "Resiko terlalu besar" },
  { option: "Lokasi terlalu jauh", label: "Lokasi terlalu jauh" },
  { option: "", label: "Other" },
];

const MerchantBookingPending = ({
  bookingDetailData,
}: MerchantBookingPendingProps) => {
  const queryClient = useQueryClient();

  const formAccept = useForm<TAcceptBookingSchema>({
    resolver: zodResolver(AcceptBookingSchema),
  });

  const { mutate: updateRejectBooking, isPending: updateRejectBookingLoading } =
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

  const { mutate: updateAcceptBooking, isPending: updateAcceptBookingLoading } =
    useMutation({
      mutationFn: (values: TAcceptBookingSchema) =>
        axios.patch(
          `/api/merchant/booking/${bookingDetailData.bookingId}/edit/accept`,
          values
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getBookingDetailData", bookingDetailData.bookingId],
        });
        toast({
          title: "Berhasil menerima order ini!",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menerima order ini!",
          variant: "destructive",
        });
      },
    });

  function onSubmitAccept(data: TAcceptBookingSchema) {
    updateAcceptBooking(data);
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <Image
          src="/Enthusiastic-cuate.svg"
          alt="bookDetailBanner"
          className=" w-96 "
          width={900}
          height={500}
        />
      </div>
      <div className="grid gap-5 pt-10">
        <div className="flex justify-center">
          <h1 className=" text-lg sm:text-2xl font-bold text-center bg-green-400 rounded-lg p-3 text-white w-fit">
            Kamu menerima orderan baru!
          </h1>
        </div>
        <div className="flex gap-10 justify-center items-center pt-5">
          <DialogGeneral
            dialogTitle="Alasan Penolakan"
            dialogContent={
              <RadioGroupForm
                onSubmitRadio={(value: any) => updateRejectBooking(value)}
                onSubmitLoading={updateRejectBookingLoading}
                defaultValue={radioOptionsForRejectReason[0]?.option ?? ""}
                options={radioOptionsForRejectReason}
              />
            }
            dialogTrigger={<Button variant={"destructive"}>Tolak</Button>}
          />
          <DialogGeneral
            dialogTitle="Masukan estimasi harga dan alasan"
            dialogContent={
              <div>
                <Form {...formAccept}>
                  <form onSubmit={formAccept.handleSubmit(onSubmitAccept)}>
                    <FormLabel>Estimasi Harga</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <FormField
                        control={formAccept.control}
                        name="bookingPriceMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="100000"
                                {...field}
                                onChange={(e) =>
                                  formAccept.setValue(
                                    "bookingPriceMin",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formAccept.control}
                        name="bookingPriceMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="200000"
                                {...field}
                                onChange={(e) =>
                                  formAccept.setValue(
                                    "bookingPriceMax",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={formAccept.control}
                      name="bookingDesc"
                      render={({ field }) => (
                        <FormItem className="pt-4">
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Harus ganti kapasitor sebesar RP 500.000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4 flex justify-end ">
                      <ButtonWithLoader
                        buttonText="Submit"
                        className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
                        type="submit"
                        isLoading={updateAcceptBookingLoading}
                      />
                    </div>
                  </form>
                </Form>
              </div>
            }
            dialogTrigger={<Button variant={"outline"}>Terima</Button>}
          />
        </div>
        <p className="text-xs text-red-400 italic text-center">
          *Mohon segera melakukan aksi tolak atau terima, Jika tidak maka akan
          ada tenggang waktu pada order ini.
        </p>
        <div className="bg-gray-100 p-5 rounded-lg space-y-5">
          <h2 className="font-semibold text-md sm:text-xl text-center">
            Data User
          </h2>
          <div>
            <p className="text-sm sm:text-lg text-left">Nama:</p>
            <p className=" text-sm sm:text-md font-semibold text-left">
              {bookingDetailData.user.name}
            </p>
          </div>
          <div>
            <h1 className="text-left text-sm sm:text-lg">Alamat:</h1>
            <p className=" text-left text-sm sm:text-md font-semibold">
              {bookingDetailData.address.addressDetail},{" "}
              {bookingDetailData.address.addressCity},{" "}
              {bookingDetailData.address.addressProvince},{" "}
              {bookingDetailData.address.addressZipCode}
            </p>
          </div>
        </div>
        <div className="bg-gray-100 p-5 rounded-lg space-y-5">
          <h1 className="font-semibold text-md sm:text-xl text-center">
            Keluhan User
          </h1>
          <div>
            <h2 className="pt-2 text-left text-sm sm:text-lg">Keluhan:</h2>
            <p className=" text-left text-sm sm:text-md font-semibold">
              {bookingDetailData.bookingComplain}
            </p>
          </div>
          <div>
            <h2 className="pt-2 text-left text-sm sm:text-lg">Foto:</h2>
            <div className="flex justify-center">
              <Image
                src={bookingDetailData.bookingPhotoUrl}
                alt={bookingDetailData.bookingPhotoUrl}
                className=" text-sm sm:text-md font-semibold"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div>
            <h2 className="pt-2 text-left text-sm sm:text-lg">
              Permintaan Tanggal Janji:
            </h2>
            <p className=" text-left text-sm sm:text-md font-semibold">
              {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantBookingPending;
