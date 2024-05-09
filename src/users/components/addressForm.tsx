"use client";

import { AddressModel, AddressSchema } from "@/addresses/types";
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

interface AddressProps {
  onPrevious: Function;
}

const AddressForm = ({ onPrevious }: AddressProps) => {
  const router = useRouter();

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const Addressform = useForm<AddressModel>({
    resolver: zodResolver(AddressSchema),
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
      console.log("Province not found");
      return undefined;
    }
  }

  useEffect(() => {
    getProvince();
    getCityLocation();
  }, []);

  async function handleSubmit(AddressForm: AddressModel) {
    const response = await postData(`/api/user/address/`, AddressForm);
    handleError(response);
    if (response.status === 200) {
      router.push("/");
    }
  }

  function handleError(response: any) {
    switch (response.data.status) {
      case "ErrOTPIncorrect":
        toast({
          title: "OTP yang anda masukan salah",
          variant: "destructive",
        });
        break;
      case "ErrOTPExpired":
        toast({
          title: "OTP anda telah expired",
          variant: "destructive",
        });
        break;
      default:
    }
  }

  function onSubmitAddressForm(Addressform: AddressModel) {
    try {
      handleSubmit(Addressform);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form {...Addressform}>
        <form
          className="w-full"
          onSubmit={Addressform.handleSubmit(onSubmitAddressForm)}
        >
          <>
            <FormField
              control={Addressform.control}
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
              control={Addressform.control}
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
              control={Addressform.control}
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
              control={Addressform.control}
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
          <div className="flex justify-between pt-5">
            <Button onClick={() => onPrevious()}>Back</Button>
            <Button
              type="submit"
              variant="secondary"
              className="hover:shadow-md hover:shadow-yellow-200 transition duration-500 "
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
