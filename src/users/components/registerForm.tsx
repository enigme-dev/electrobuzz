"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { UpdateProfileModel, UpdateProfileSchema } from "../types";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { updateData } from "@/core/lib/service";

interface RegisterProps {
  onNext: Function;
}

const RegisterForm = ({ onNext }: RegisterProps) => {
  const { data: session } = useSession();

  const form = useForm<UpdateProfileModel>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  function onSubmit(values: UpdateProfileModel) {
    try {
      updateData(
        `${process.env.NEXT_PUBLIC_APP_HOST}/api/user/${session?.user?.id}`,
        values
      );
    } catch (error) {
      console.error(error);
    }
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telpon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right pt-5">
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
  );
};

export default RegisterForm;
