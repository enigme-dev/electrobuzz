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
  RegisterMerchantSchema,
  TRegisterMerchantSchema,
} from "@/merchants/types";
import MultipleSelector, { Option } from "@/core/components/multi-select";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { fileInputToDataURL } from "@/core/lib/utils";

interface RegisterAsMerchantFormProps {
  onNext: Function;
}

const OPTIONS: Option[] = [
  { label: "AC", value: "AC" },
  { label: "TV", value: "TV" },
  { label: "Kulkas", value: "Kulkas" },
  { label: "Smartphone", value: "Smartphon" },
  { label: "Mesin Cuci", value: "Mesin Cuci" },
  { label: "Laptop", value: "Laptop" },
  { label: "Microwave", value: "Microwave" },
];

const RegisterAsMerchantForm = ({ onNext }: RegisterAsMerchantFormProps) => {
  const { toast } = useToast();

  const form = useForm<TRegisterMerchantSchema>({
    resolver: zodResolver(RegisterMerchantSchema),
  });

  const { mutate: addMerchantData, isPending: updateLoading } = useMutation({
    mutationFn: (values: TRegisterMerchantSchema) =>
      axios.post(`/api/merchant/identity`, values),
    onSuccess: () => {
      toast({
        title: "Formulir anda telah terkirim!",
        description: "mohon menunggu konfirmasi admin",
      });
    },
  });

  function onSubmit(data: TRegisterMerchantSchema) {
    const fileKTPImage = form.getValues("merchantIdentity.identityKTP");
    addMerchantData(data);
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
    <div className="wrapper pt-10 sm:pt-0 px-4">
      <h1 className="font-bold text-xl pb-10">Daftar Sebagai Mitra</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="merchantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Toko</FormLabel>
                <FormControl>
                  <Input placeholder="Nama tokomu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={
                      field.value
                        ? field.value.map((value) => ({
                            label: value,
                            value,
                          }))
                        : []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(
                        (option) => option.value
                      );
                      field.onChange(selectedValues);
                    }}
                    defaultOptions={OPTIONS}
                    hidePlaceholderWhenSelected
                    placeholder="Pilih kategorimu"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormDescription>
                  isi kategori sesuai dengan keahlianmu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Rumah atau Toko</FormLabel>
                <FormControl>
                  <Input placeholder="Alamat lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Rumah atau Toko</FormLabel>
                <FormControl>
                  <Input placeholder="Alamat lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Input placeholder="Deskripsikan tokomu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantPhotoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Banner</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => handleFileInputChange(e, field)}
                    id="picture"
                    type="file"
                  />
                </FormControl>
                <FormDescription>Foto Bannermu nanti</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="merchantIdentity.identityKTP"
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
            name="merchantIdentity.identitySKCK"
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
            name="merchantIdentity.identityDocs"
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

          <div className="text-right">
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-black dark:text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default RegisterAsMerchantForm;
