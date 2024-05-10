"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/core/components/ui/calendar";
import { cn } from "@/core/lib/shadcn";
import { format } from "date-fns";
import MultipleSelector, { Option } from "@/core/components/multi-select";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  merchantName: z.string({
    required_error: "tolong deskripsikan keluhanmu",
  }),
  merchantCategory: z.array(optionSchema).min(1),
  merchantProvince: z.string({
    required_error: "tolong isi provinsimu",
  }),
  merchantCity: z.string({
    required_error: "tolong isi kotamu",
  }),
  merchantLat: z.string({
    required_error: "tolong isi alamatmu",
  }),
  merchantLong: z.string({
    required_error: "tolong isi alamatmu",
  }),

  merchantDesc: z.string({
    required_error: "tolong deskripsikan tentang tokomu",
  }),
  merchantPhotoUrl: z.string().refine(
    (value) => {
      const allowedExtensions = /\.(jpg|jpeg|png)$/i;
      return allowedExtensions.test(value);
    },
    {
      message: "Foto bannermu harus berupa file JPG atau PNG",
      path: ["foto"],
    }
  ),
  merchantIdentity: z.object({
    identityKTP: z.string().refine(
      (value) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        return allowedExtensions.test(value);
      },
      {
        message: "Foto bannermu harus berupa file JPG atau PNG",
        path: ["foto"],
      }
    ),
    identitySKCK: z.string().refine(
      (value) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        return allowedExtensions.test(value);
      },
      {
        message: "Foto bannermu harus berupa file JPG atau PNG",
        path: ["foto"],
      }
    ),
    identityDocs: z.string().refine(
      (value) => {
        const allowedExtensions = /\.(jpg|jpeg|png)$/i;
        return allowedExtensions.test(value);
      },
      {
        message: "Foto bannermu harus berupa file JPG atau PNG",
        path: ["foto"],
      }
    ),
  }),
});

interface RegisterAsMerchantFormProps {
  onPrevious: Function;
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

const RegisterAsMerchantForm = ({
  onNext,
  onPrevious,
}: RegisterAsMerchantFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    onNext();
  }

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
                    value={field.value}
                    onChange={field.onChange}
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
                  <Input id="picture" type="file" {...field} />
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
                  <Input id="picture" type="file" {...field} />
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
                  <Input id="picture" type="file" {...field} />
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
                  <Input id="picture" type="file" {...field} />
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
