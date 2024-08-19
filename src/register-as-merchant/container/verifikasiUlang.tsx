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
import { Input } from "@/core/components/ui/input";
import { useToast } from "@/core/components/ui/use-toast";

import {
  MerchantIdentitiesSchema,
  TMerchantIdentityModel,
} from "@/merchants/types";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { fileInputToDataURL } from "@/core/lib/utils";
import { useSession } from "next-auth/react";
import ButtonWithLoader from "@/core/components/buttonWithLoader";

const VerifikasiUlang = () => {
  const { update } = useSession();
  const { toast } = useToast();

  const form = useForm<TMerchantIdentityModel>({
    resolver: zodResolver(MerchantIdentitiesSchema),
  });

  const { mutate: addMerchantIdentity, isPending: addMerchantIdentityLoading } =
    useMutation({
      mutationFn: (values: TMerchantIdentityModel) =>
        axios.post(`/api/merchant/identity`, values),
      onSuccess: () => {
        toast({
          title: "Formulir anda telah terkirim!",
          description: "mohon menunggu konfirmasi admin",
        });
        update({
          isMerchant: "pending",
        });
      },
      onError: (error) => {
        handleError(error);
      },
    });

  function handleError(error: any) {
    switch (error.response.data.status) {
      case "ErrForbidden":
        toast({
          title: "Mohon verifikasi nomor handphone!",
          variant: "destructive",
        });
        break;
    }
  }

  function onSubmit(data: TMerchantIdentityModel) {
    addMerchantIdentity(data);
  }

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

  return (
    <div className="wrapper px-4 pt-10 sm:pt-0">
      <h1 className="font-bold text-xl pb-10">Daftar Sebagai Mitra</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identityKTP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto KTP</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => handleFileInputChange(e, field)}
                    id="picture"
                    type="file"
                  />
                </FormControl>
                <FormDescription>Foto KTP asli</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identitySKCK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Foto SKCK (Surat Keterangan Catatan Kepolisian)
                </FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => handleFileInputChange(e, field)}
                    id="picture"
                    type="file"
                  />
                </FormControl>
                <FormDescription>Foto SKCK asli </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identityDocs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dokumen Sertifikasi</FormLabel>
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
          <div className="flex justify-end w-full">
            <ButtonWithLoader
              buttonText="Submit"
              isLoading={addMerchantIdentityLoading}
              type="submit"
              variant="secondary"
              className={
                " bg-yellow-400 hover:bg-yellow-300 text-black  transition duration-500 flex gap-4 items-center"
              }
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
export default VerifikasiUlang;
