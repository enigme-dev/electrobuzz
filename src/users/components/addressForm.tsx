"use client";

import { AddressModel, AddressSchema } from "@/addresses/types";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface AddressProps {
  onPrevious: Function;
}

const AddressForm = ({ onPrevious }: AddressProps) => {
  const Addressform = useForm<AddressModel>({
    resolver: zodResolver(AddressSchema),
  });

  function onSubmitAddressForm(Addressform: AddressModel) {
    console.log(Addressform);
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
                      <h1 className="pb-2 font-semibold">Address</h1>
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
              name="addressCity"
              render={({ field }) => (
                <FormItem>
                  <div className="pt-5 flex-col justify-between md:flex ">
                    <div>
                      <h1 className="pb-2 font-semibold">Kota</h1>
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
