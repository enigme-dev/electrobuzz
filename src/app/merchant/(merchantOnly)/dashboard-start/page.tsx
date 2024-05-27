"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/core/components/ui/use-toast";
import axios from "axios";
import Loader from "@/core/components/loader/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fileInputToDataURL } from "@/core/lib/utils";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { AlbumsSchema, TAlbumsSchema } from "@/merchants/types";

interface FileObject {
  albumPhotoUrl: string;
}

const MerchantDashboardStart = () => {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [imagePreview, setImagePreview] = useState<FileObject[]>([]);

  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<TAlbumsSchema>({
    resolver: zodResolver(AlbumsSchema),
    defaultValues: { albums: [] },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (fileObjects.length > 0) {
      form.setValue("albums", fileObjects, { shouldValidate: true });
    }
  }, [fileObjects, form]);

  const { mutate: addAlbumPhoto, isPending: AddAlbumPhotoLoading } =
    useMutation({
      mutationFn: (values: TAlbumsSchema) =>
        axios.post(`/api/merchant/album`, values),
      onSuccess: () => {
        toast({ title: "Tambah foto album berhasil!" });
        queryClient.invalidateQueries({
          queryKey: [
            "getMerchantDetails",
            "getMerchantAlbum",
            session?.user?.id,
          ],
        });
        router.push("/merchant/dashboard/profile");
      },
      onError: () => {
        toast({ title: "Tambah foto album gagal!", variant: "destructive" });
      },
    });

  function onSubmit(values: TAlbumsSchema) {
    addAlbumPhoto(values);
  }

  const MAX_FILES = 4;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (fileObjects.length + files.length > MAX_FILES) {
      toast({
        title: `Maximum upload hanya ${MAX_FILES} foto!`,
        variant: "destructive",
      });
      return;
    }

    const imagePreview = files.map((file) => ({
      albumPhotoUrl: URL.createObjectURL(file),
    }));

    const newFileObjects = await Promise.all(
      files.map(async (file) => ({
        albumPhotoUrl: await fileInputToDataURL(file),
      }))
    );

    setImagePreview((prevImagePreview: FileObject[]) => [
      ...prevImagePreview,
      ...imagePreview,
    ]);

    setFileObjects((prevFileObjects: FileObject[]) => [
      ...prevFileObjects,
      ...newFileObjects,
    ]);
  };

  const handleDelete = (index: number) => {
    const updatedImagePreview = imagePreview.filter((_, i) => i !== index);
    setImagePreview(updatedImagePreview);
    const updatedFileObjects = fileObjects.filter((_, i) => i !== index);
    setFileObjects(updatedFileObjects);
    form.setValue("albums", updatedFileObjects, { shouldValidate: true });
  };

  console.log(form.getValues("albums"));
  return (
    <div className="wrapper flex justify-center flex-col h-[100%] pb-20 sm:pb-0 lg:flex-row items-center px-4">
      <div className="">
        <Image
          src={"/Business merger-cuate.svg"}
          width={350}
          height={350}
          alt="Business merger-cuate."
          className="w-[350px] h-[350px] sm:w-[600px] sm:h-[600px]"
        />
      </div>
      <div>
        <p className="animate-fade-in-5 text-2xl font-bold">
          Selamat! identitas kamu telah disetujui Admin...
        </p>
        <p className="animate-fade-in-9  text-md sm:text-lg">
          Terima kasih telah bergabung bersama kami, tolong lengkapi datamu
          supaya tokomu lebih menarik!
        </p>
        <label className="text-xs sm:text-sm text-gray-500">
          Upload Fotomu sebagai teknisi :{" "}
          <span className="text-gray-300 italic">(maks 4)</span>
        </label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-6 mt-5"
          >
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <FormField
                control={form.control}
                name="albums"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-lg h-[120px] w-[100px] grid place-items-center text-gray-400">
                        <FormLabel
                          className="flex flex-col items-center gap-1"
                          htmlFor="images"
                        >
                          <UploadIcon className="h-6 w-6" />
                          <span className="underline text-xs underline-offset-2 underline-offset-white-0.5 transition-none p-1">
                            Click to upload
                          </span>
                          <Input
                            className="hidden"
                            id="images"
                            multiple
                            type="file"
                            onChange={(e) => {
                              onFileChange(e);
                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </FormLabel>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview.map((album, index) => (
                <div key={index} className="w-24 h-[100px] relative">
                  <Image
                    src={album.albumPhotoUrl}
                    alt={`Uploaded image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                    onClick={() => handleDelete(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-end">
              <ButtonWithLoader
                buttonText="Submit"
                type="submit"
                className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
                isLoading={AddAlbumPhotoLoading}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MerchantDashboardStart;
