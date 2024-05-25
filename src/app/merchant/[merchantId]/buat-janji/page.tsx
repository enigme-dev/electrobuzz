"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { useToast } from "@/core/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { CalendarIcon, Settings } from "lucide-react";
import { Calendar } from "@/core/components/ui/calendar";
import { cn } from "@/core/lib/shadcn";
import { format, parseISO } from "date-fns";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import {
  BookingModel,
  CreateBookingSchema,
  TBookingModel,
  TCreateBookingSchema,
} from "@/bookings/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Select } from "@/core/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Card } from "@/core/components/ui/card";
import { DialogGeneral } from "@/core/components/general-dialog";
import AddressForm from "@/users/components/addressForm";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { fileInputToDataURL } from "@/core/lib/utils";

interface AddressData {
  addressCity: string;
  addressDetail: string;
  addressId: string;
  addressProvince: string;
  addressZipCode: string;
}
const extractIdFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/\/merchant\/([^\/]+)\//);
  return match ? match[1] : null;
};

const BuatJanjiPage = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const pathname = usePathname();

  const merchantId = extractIdFromPathname(pathname);

  const [onOpen, setOnOpenDialog] = useState(false);

  const form = useForm<TCreateBookingSchema>({
    resolver: zodResolver(CreateBookingSchema),
  });

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOnOpenDialog(false);
    }
  }

  const { data: addressData, isLoading: isAddressLoading } = useQuery({
    queryKey: ["userAddressData"],
    queryFn: async () =>
      await axios.get(`/api/user/address`).then((response) => {
        return response.data.data as AddressData[];
      }),
  });
  const { mutate: createBookingAppointment, isPending: addAddressLoading } =
    useMutation({
      mutationFn: async (values: TCreateBookingSchema) =>
        await axios.post(`/api/merchant/${merchantId}/book`, values),
      onSuccess: () => {
        toast({ title: "Keluhan anda telah terkirim!" });
        queryClient.invalidateQueries({
          queryKey: ["getBookingData", merchantId],
        });
      },
      onError: () => {
        toast({
          title: "Keluhan anda gagal terkirim!",
          variant: "destructive",
        });
      },
    });

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      fileInputToDataURL(fileInput)
        .then((dataURL) => {
          field.onChange(dataURL);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };

  const handleDateChange = (date: Date | undefined, field: any) => {
    if (date) {
      field.onChange(date.toISOString());
    }
  };

  function onSubmit(data: TCreateBookingSchema) {
    createBookingAppointment(data);
  }

  console.log(merchantId);

  return (
    <div className="wrapper pb-20 pt-10 sm:py-10 px-4">
      <h1 className="font-bold text-xl pb-10">Form Buat Janji</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bookingComplain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keluhan</FormLabel>
                <FormControl>
                  <Input placeholder="Deskripsikan keluhanmu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookingPhotoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => handleFileInputChange(e, field)}
                    id="picture"
                    type="file"
                  />
                </FormControl>
                <FormDescription>Foto keluhanmu </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {addressData != undefined &&
                      (addressData?.length !== 0 ? (
                        addressData.map(
                          (option: AddressData, index: number) => (
                            <FormItem
                              key={index}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  className="rounded-full"
                                  value={option.addressId}
                                />
                              </FormControl>
                              <Card className="p-3 w-screen flex items-center justify-between">
                                <div className="text-xs sm:text-md ">
                                  {option.addressDetail}, {option.addressCity}
                                  ,&nbsp;
                                  {option.addressProvince},{" "}
                                  {option.addressZipCode}
                                </div>
                                <div className="flex items-center">
                                  <DialogGeneral
                                    dialogTitle="Edit Alamat"
                                    onOpen={onOpen}
                                    onOpenChange={handleOpenChange}
                                    dialogContent={
                                      <>
                                        <AddressForm
                                          handleOnCloseDialog={() =>
                                            setOnOpenDialog(false)
                                          }
                                          initialAddressData={{
                                            addressDetail: option.addressDetail,
                                            addressId: option.addressId,
                                            addressCity: option.addressCity,
                                            addressProvince:
                                              option.addressProvince,
                                            addressZipCode:
                                              option.addressZipCode,
                                          }}
                                          isEditing={true}
                                        />
                                      </>
                                    }
                                    dialogTrigger={
                                      <Button
                                        variant={"outline"}
                                        onClick={() => setOnOpenDialog(true)}
                                      >
                                        Ubah
                                      </Button>
                                    }
                                  />
                                </div>
                              </Card>
                            </FormItem>
                          )
                        )
                      ) : (
                        <>
                          <FormControl>
                            <Input placeholder="Alamat" {...field} />
                          </FormControl>
                        </>
                      ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookingSchedule"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal janji</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parseISO(field.value), "PPP")
                        ) : (
                          <span>input tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) => handleDateChange(date, field)}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Kamu dapat memilih tanggal minimal satu hari setelah pembuatan
                  janji
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <ButtonWithLoader
              className=""
              isLoading={false}
              buttonText="Submit"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
export default BuatJanjiPage;
