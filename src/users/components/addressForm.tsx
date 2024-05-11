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

interface AddressProps {
  onPrevious?: Function;
  isEditing?: boolean;
  initialAddressData?: any;
  handleOnOpenDialog?: Function;
}

const AddressForm = ({
  onPrevious,
  isEditing,
  initialAddressData,
  handleOnOpenDialog,
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

  console.log(isEditing);

  const { mutate: addAddressData, isPending: addAddressLoading } = useMutation({
    mutationFn: (values: AddressModel) =>
      axios.post(`/api/user/address`, values),
    onSuccess: () => {
      toast({ title: "Tambah alamat berhasil!" });
      if (handleOnOpenDialog) {
        handleOnOpenDialog();
      }
      queryClient.invalidateQueries({
        queryKey: ["userAddressData", session?.user?.id],
      });
      if (isEditing === undefined) {
        router.push("/");
      }
    },
    onError: (error: any) => {
      console.log(error.response.data.status);
      if (error.response.data.status === "ErrValidation") {
        toast({
          title: "Tambah alamat gagal!",
          description: "Maximum alamat hanya 3",
          variant: "destructive",
        });
      }
    },
  });

  console.log(initialAddressData);

  const { mutate: editAddress, isPending: editAddressLoading } = useMutation({
    mutationFn: (values: AddressModel) =>
      axios.patch(`/api/user/address/${initialAddressData.addressId}`, values),

    onSuccess: () => {
      toast({ title: "edit alamat berhasil!" });
      queryClient.invalidateQueries({
        queryKey: ["userAddressData", session?.user?.id],
      });
      if (handleOnOpenDialog) {
        handleOnOpenDialog();
      }
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

  function getCityByProvinceId(value?: {
    item: string;
    value: string;
    id?: string;
  }) {
    const selectedValue: any = provinceOptions.filter((item: any) => {
      return item.value === value;
    });
    if (selectedValue.length > 0) {
      const id = selectedValue[0].id;
      getCityLocation(id);
    } else {
      return undefined;
    }
  }

  useEffect(() => {
    getProvince();
    getCityLocation();
  }, [isEditing]);

  function onSubmitAddressForm(AddressForm: AddressModel) {
    try {
      console.log("trigger");
      if (!isEditing || isEditing === undefined) {
        addAddressData(AddressForm);
      } else {
        editAddress(AddressForm);
      }
    } catch (error) {
      console.error(error);
    }
  }
  console.log(isEditing);
  console.log(AddressForm.getValues("addressId"));
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
                  <div className="pt-5 flex-col justify-between md:flex ">
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
                            getCityByProvinceId(value);
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
                : "lex justify-between pt-5"
            }
          >
            {isEditing === undefined && (
              <Button onClick={() => (onPrevious ? onPrevious() : undefined)}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="secondary"
              className={
                "hover:shadow-md hover:shadow-yellow-200 transition duration-500 "
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddressForm;
