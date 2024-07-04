"use client";

import { SelectOption } from "@/core/components/select-option";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { toast } from "@/core/components/ui/use-toast";
import { getData, postData } from "@/core/lib/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressModel, AddressSchema, UpdateProfileModel } from "@/users/types";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ButtonWithLoader from "@/core/components/buttonWithLoader";

interface AddressProps {
  onPrevious?: Function;
  isEditing?: boolean;
  initialAddressData?: {
    addressId: string;
    addressDetail: string;
    addressProvince: string;
    addressCity: string;
    addressZipCode: string;
  };
  handleOnCloseDialog: Function;
}

const AddressForm = ({
  onPrevious,
  isEditing,
  initialAddressData,
  handleOnCloseDialog,
}: AddressProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const AddressForm = useForm<AddressModel>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      addressId: isEditing ? initialAddressData?.addressId : undefined,
      addressCity: "",
      addressProvince: "",
      addressDetail: isEditing ? initialAddressData?.addressDetail : "",
      addressZipCode: isEditing ? initialAddressData?.addressZipCode : "",
      userId: isEditing ? session?.user?.id : undefined,
    },
  });

  const { mutate: addAddressData, isPending: addAddressLoading } = useMutation({
    mutationFn: async (values: AddressModel) =>
      await axios.post(`/api/user/address`, values),
    onSuccess: () => {
      handleOnCloseDialog();
      toast({ title: "Tambah alamat berhasil!" });
      queryClient.invalidateQueries({
        queryKey: ["userAddressData", session?.user?.id],
      });
      if (isEditing === undefined) {
        router.push("/");
      }
    },
    onError: (error: any) => {
      if (error.response.data.status === "ErrValidation") {
        toast({
          title: "Tambah alamat gagal!",
          description: "Maximum alamat hanya 3",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: editAddress, isPending: editAddressLoading } = useMutation({
    mutationFn: async (values: AddressModel) =>
      await axios.patch(
        `/api/user/address/${initialAddressData?.addressId}`,
        values
      ),

    onSuccess: () => {
      toast({ title: "Edit alamat berhasil!" });
      queryClient.invalidateQueries({
        queryKey: ["userAddressData", session?.user?.id],
      });
    },

    onError: () => {
      toast({ title: "Edit alamat gagal!", variant: "destructive" });
    },
  });

  async function getProvince() {
    const provinceResponse = await getData(
      "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
    );
    const provinceOptions = provinceResponse.map((province: any) => ({
      item: province.name,
      value: province.name,
      id: province.id,
    }));
    setProvinceOptions(provinceOptions);
  }

  async function getCityLocation(id?: string) {
    const cityResponse = await getData(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`
    );
    if (id) {
      const cityOptions = cityResponse?.map((city: any) => ({
        item: city.name,
        value: city.name,
      }));
      setCityOptions(cityOptions);
    }
  }

  useEffect(() => {
    getProvince();
  }, [isEditing]);

  function onSubmitAddressForm(AddressForm: AddressModel) {
    try {
      if (!isEditing || isEditing === undefined) {
        addAddressData(AddressForm);
      } else {
        editAddress(AddressForm);
        handleOnCloseDialog();
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <Form {...AddressForm}>
        <form
          className="w-full"
          onSubmit={AddressForm.handleSubmit(onSubmitAddressForm)}
        >
          <>
            <FormField
              control={AddressForm.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <div className="flex-col justify-between md:flex ">
                    <div>
                      <h1 className="pb-2 font-semibold">Alamat lengkap</h1>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={AddressForm.control}
              name="addressProvince"
              render={({ field }) => (
                <FormItem>
                  <div className="pt-5 flex-col justify-between md:flex ">
                    <div>
                      <h1 className="pb-2 font-semibold">Provinsi</h1>
                      <FormControl>
                        <SelectOption
                          placeholder="Pilih Provinsi"
                          selectLabel={"Provinsi"}
                          selectList={provinceOptions}
                          defaultValue={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            getCityLocation(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={AddressForm.control}
              name="addressCity"
              render={({ field }) => (
                <FormItem>
                  <div className="pt-5 flex-col justify-between md:flex ">
                    <div>
                      <h1 className="pb-2 font-semibold">Kota</h1>
                      <FormControl>
                        <SelectOption
                          placeholder="Pilih Kota"
                          selectLabel={"Kota"}
                          selectList={cityOptions}
                          defaultValue={undefined}
                          onValueChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={AddressForm.control}
              name="addressZipCode"
              render={({ field }) => (
                <FormItem>
                  <div className="pt-5 flex-col justify-between md:flex ">
                    <div>
                      <h1 className="pb-2 font-semibold">Kode Pos</h1>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </>
          <div
            className={
              isEditing !== undefined
                ? "flex justify-end pt-5"
                : "flex justify-between pt-5"
            }
          >
            {isEditing === undefined && (
              <Button onClick={() => (onPrevious ? onPrevious() : undefined)}>
                Back
              </Button>
            )}
            <ButtonWithLoader
              buttonText="Submit"
              isLoading={addAddressLoading || editAddressLoading}
              type="submit"
              variant="secondary"
              className={
                " bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
              }
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddressForm;
