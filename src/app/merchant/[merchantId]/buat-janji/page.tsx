"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CalendarIcon, PlusIcon, Settings, SquarePen } from "lucide-react";
import { Calendar } from "@/core/components/ui/calendar";
import { cn } from "@/core/lib/shadcn";
import { format, parseISO } from "date-fns";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { CreateBookingSchema, TCreateBookingSchema } from "@/bookings/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Card } from "@/core/components/ui/card";
import { DialogGeneral } from "@/core/components/general-dialog";
import AddressForm from "@/users/components/addressForm";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fileInputToDataURL } from "@/core/lib/utils";
import Loader from "@/core/components/loader/loader";
import { Label } from "@/core/components/ui/label";
import { Logger } from "@/core/lib/logger";

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
  const router = useRouter();
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
    queryKey: ["userAddressData", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/user/address`).then((response) => {
        return response.data.data as AddressData[];
      }),
  });

  const {
    mutate: createBookingAppointment,
    isPending: createBookingAppointmentLoading,
  } = useMutation({
    mutationFn: async (values: TCreateBookingSchema) =>
      await axios.post(`/api/merchant/${merchantId}/book`, values),
    onSuccess: () => {
      toast({ title: "Keluhan anda telah terkirim!" });
      queryClient.invalidateQueries({
        queryKey: ["getBookingData", merchantId],
      });
      router.push("/user/my-bookings");
    },
    onError: (error: any) => {
      const errorMessage = error.response.data.data;
      if (errorMessage === "phone is not registered") {
        toast({
          title: "Keluhan anda gagal terkirim!",
          description: "Mohon verifikasi nomor hp",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Keluhan anda gagal terkirim!",
          variant: "destructive",
        });
      }
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
    console.log(date?.toISOString());
    if (date) {
      field.onChange(date.toISOString());
    }
  };

  function onSubmit(data: TCreateBookingSchema) {
    createBookingAppointment(data);
  }

  if (isAddressLoading) {
    return <Loader />;
  }

  return (
    <div className="wrapper pb-20 pt-10 sm:py-10 px-4">
      <h1 className="font-bold text-2xl pb-4">Form Buat Janji</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bookingComplain"
            render={({ field }) => (
              <FormItem className="md:max-w-[700px]">
                <FormLabel>Deskripsi Keluhan</FormLabel>
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
              <FormItem className="md:max-w-[700px]">
                <FormLabel>Foto Keluhan</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => handleFileInputChange(e, field)}
                    id="picture"
                    type="file"
                  />
                </FormControl>
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
                  {addressData &&
                    (addressData.length > 0 ? (
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
                      >
                        {addressData.map((option: AddressData) => (
                          <div key={option.addressId}>
                            <RadioGroupItem
                              value={option.addressId}
                              id={option.addressId}
                              aria-label={option.addressId}
                              className="sr-only peer"
                            />
                            <Label
                              htmlFor={option.addressId}
                              className="grow flex justify-between h-full rounded-lg border-2 border-accent peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
                            >
                              <div className="flex flex-col gap-2 p-4">
                                <span>{option.addressDetail}</span>
                                <span>{`${option.addressCity}, ${option.addressProvince}`}</span>
                                <span>{option.addressZipCode}</span>
                              </div>
                              <div>
                                <DialogGeneral
                                  dialogTitle="Edit Alamat"
                                  onOpen={onOpen}
                                  onOpenChange={handleOpenChange}
                                  dialogContent={
                                    <AddressForm
                                      handleOnCloseDialog={() =>
                                        setOnOpenDialog(false)
                                      }
                                      initialAddressData={{
                                        addressDetail: option.addressDetail,
                                        addressId: option.addressId,
                                        addressCity: option.addressCity,
                                        addressProvince: option.addressProvince,
                                        addressZipCode: option.addressZipCode,
                                      }}
                                      isEditing={true}
                                    />
                                  }
                                  dialogTrigger={
                                    <Button
                                      variant="link"
                                      className="text-gray-500"
                                      onClick={() => setOnOpenDialog(true)}
                                    >
                                      <SquarePen size={18} />
                                    </Button>
                                  }
                                />
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <DialogGeneral
                        dialogTitle={"Edit Profile"}
                        onOpen={onOpen}
                        onOpenChange={handleOpenChange}
                        dialogContent={
                          <AddressForm
                            handleOnCloseDialog={handleOpenChange}
                            isEditing={false}
                          />
                        }
                        dialogTrigger={
                          <Card
                            className=" flex items-center  w-fit  px-2 py-1 hover:cursor-pointer dark:text-black bg-yellow-400 hover:bg-yellow-300"
                            onClick={() => {
                              setOnOpenDialog(true);
                            }}
                          >
                            <PlusIcon
                              className="p-1 rounded-full hover:cursor-pointer"
                              size={20}
                            />
                            <p className="text-xs sm:text-sm ">Tambah alamat</p>
                          </Card>
                        }
                      />
                    ))}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookingSchedule"
            render={({ field }) => (
              <FormItem className="flex flex-col md:max-w-[700px]">
                <FormLabel>Tanggal Servis</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parseISO(field.value), "PPP")
                        ) : (
                          <span>Masukkan tanggal servis</span>
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
                <FormDescription className="italic">
                  * minimal satu hari dari tanggal janji dibuat
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end md:max-w-[700px]">
            <ButtonWithLoader
              className="flex gap-4 items-center w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black"
              isLoading={createBookingAppointmentLoading}
              buttonText="Buat janji"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
export default BuatJanjiPage;
