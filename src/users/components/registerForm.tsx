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
import axios from "axios";
import { useToast } from "@/core/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "@/core/components/loader";

interface RegisterProps {
  onNext: Function;
  isEditing?: boolean;
  isEditName?: boolean;
  isEditPhone?: boolean;
  initialFormValues?: any;
  handleCloseDialog: Function;
}

const RegisterForm = ({
  onNext,
  isEditing,
  isEditName,
  isEditPhone,
  initialFormValues,
  handleCloseDialog,
}: RegisterProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<UpdateProfileModel>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: isEditing
        ? initialFormValues.name || ""
        : session?.user?.name || "",
      phone: isEditing ? initialFormValues.phone : "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: updateLoading } = useMutation({
    mutationFn: (values: UpdateProfileModel) =>
      axios.patch(`/api//user/${session?.user?.id}`, values),
    onSuccess: () => {
      toast({ title: "Edit profile berhasil!" });
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
    },
  });

  if (updateLoading) {
    return <Loader />;
  }

  function onSubmit(values: UpdateProfileModel) {
    try {
      if (isEditing && isEditName) {
        updateProfile(values);
        handleCloseDialog();
      } else if (isEditing && isEditPhone) {
        updateProfile(values);
        onNext();
      } else if (!isEditing) {
        updateProfile(values);
        onNext();
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log(isEditing, isEditPhone, isEditName);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        {isEditing && isEditName && (
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
        )}
        {isEditing && isEditPhone && (
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
        )}
        {!isEditing && (
          <>
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
          </>
        )}
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
