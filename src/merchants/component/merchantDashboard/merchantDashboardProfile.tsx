"use client";

import Loader from "@/core/components/loader/loader";
import MultipleSelector, { Option } from "@/core/components/multi-select";
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
import { fileInputToDataURL } from "@/core/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  LoadScriptProps,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Settings, Upload, UploadIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { getData } from "@/core/lib/service";
import { SelectOption } from "@/core/components/select-option";
import { DialogGeneral } from "@/core/components/general-dialog";
import { TUpdateMerchantSchema, UpdateMerchantSchema } from "@/merchants/types";
import MyMapComponent from "@/core/components/google-maps";

interface MyMerchantDetails {
  merchantPhotoUrl: string;
  merchantAvailable: boolean;
  merchantCategory: string[];
  merchantCity: string;
  merchantCreatedAt: string;
  merchantDesc: string;
  merchantId: string;
  merchantLat: number;
  merchantLong: number;
  merchantName: string;
  merchantProvince: string;
  merchantRating: number | null;
  merchantReviewCt: number | null;
  merchantVerified: boolean;
  merchantAlbums?: MerchantAlbum[];
}
interface MerchantAlbum {
  albumPhotoUrl: string;
  merchantAlbumId?: string;
  merchantId?: string;
}
const OPTIONS: Option[] = [
  { label: "AC", value: "AC" },
  { label: "TV", value: "TV" },
  { label: "Kulkas", value: "Kulkas" },
  { label: "Smartphone", value: "Smartphone" },
  { label: "Mesin Cuci", value: "Mesin Cuci" },
  { label: "Laptop", value: "Laptop" },
  { label: "Microwave", value: "Microwave" },
];

interface latLng {
  lat: number | null;
  lng: number | null;
}
interface FileObject {
  albumPhotoUrl: string;
  merchantAlbumId?: string;
  merchantId?: string;
}

const MerchantDashboardProfile = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isLoading: getMerchantDetailsloading, data: myMerchantDetails } =
    useQuery({
      queryKey: ["getMerchantDetails", session?.user?.id],
      queryFn: async () =>
        await axios
          .get(`/api/merchant/${session?.user?.id}`)
          .then((response) => {
            return response.data.data as MyMerchantDetails;
          }),
      enabled: !!session?.user?.id,
    });

  const [selectedLocation, setSelectedLocation] = useState<latLng>({
    lat: myMerchantDetails?.merchantLat || null,
    lng: myMerchantDetails?.merchantLong || null,
  });
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [onOpenDialog, setOnOpenDialog] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const libraries: LoadScriptProps["libraries"] = ["places"];

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    libraries: libraries,
  });

  const options = {
    componentRestrictions: { country: "idn" },
    fields: ["address_components", "geometry", "icon", "name"],
  };

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat: lat, lng: lng });
      }
    }
  };

  const markerClicked = (e: any) => {
    setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  function markerFinish(e: any) {
    setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }

  const defaultLocation = {
    lat: myMerchantDetails ? myMerchantDetails.merchantLat : -6.2,
    lng: myMerchantDetails ? myMerchantDetails.merchantLong : 106.816666,
  };

  const validLocation = {
    lat:
      selectedLocation.lat !== null
        ? selectedLocation.lat
        : defaultLocation.lat,
    lng:
      selectedLocation.lng !== null
        ? selectedLocation.lng
        : defaultLocation.lng,
  };
  useEffect(() => {
    if (myMerchantDetails) {
      setSelectedLocation({
        lat: myMerchantDetails.merchantLat,
        lng: myMerchantDetails.merchantLong,
      });
    }
  }, [myMerchantDetails]);

  useEffect(() => {
    if (selectedLocation.lat !== null && selectedLocation.lng !== null) {
      form.setValue("merchantLat", selectedLocation.lat);
      form.setValue("merchantLong", selectedLocation.lng);
    }
  }, [selectedLocation]);

  const form = useForm<TUpdateMerchantSchema>({
    resolver: zodResolver(UpdateMerchantSchema),
    defaultValues: {
      merchantName: "",
      merchantCategory: [],
      merchantProvince: "",
      merchantCity: "",
      merchantDesc: "",
      merchantLat: 0,
      merchantLong: 0,
    },
  });

  useEffect(() => {
    if (myMerchantDetails) {
      form.reset({
        merchantName: myMerchantDetails.merchantName || "",
        merchantCategory: myMerchantDetails.merchantCategory || [],
        merchantProvince: myMerchantDetails.merchantProvince || "",
        merchantCity: myMerchantDetails.merchantCity || "",
        merchantDesc: myMerchantDetails.merchantDesc || "",
        merchantLat: myMerchantDetails.merchantLat || 0,
        merchantLong: myMerchantDetails.merchantLong || 0,
      });
    }
  }, [myMerchantDetails, form]);

  const {
    mutate: updateMerchantProfile,
    isPending: updateMerchantLoadingProfile,
  } = useMutation({
    mutationFn: (values: TUpdateMerchantSchema) =>
      axios.patch(`/api/merchant/${session?.user?.id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMerchantDetails", session?.user?.id],
      });
      toast({
        title: "Update Profile Merchant Berhasil!",
      });
    },
    onError: () => {
      toast({
        title: "Update Merchant Data Gagal!",
      });
    },
  });
  const { mutate: deleteMerchantAlbum, isPending: deleteMerchantAlbumLoading } =
    useMutation({
      mutationFn: (values: any) =>
        axios.delete(`/api/merchant/album/${values}`),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getMerchantDetails", session?.user?.id],
        });
        toast({
          title: "Delete Album Merchant Berhasil!",
        });
      },
      onError: () => {
        toast({
          title: "Delete Album Merchant Gagal!",
        });
      },
    });

  const { mutate: addAlbumPhoto, isPending: AddAlbumPhotoLoading } =
    useMutation({
      mutationFn: (values: { albums: FileObject[] }) =>
        axios.post(`/api/merchant/album`, values),
      onSuccess: () => {
        toast({ title: "Tambah foto album berhasil!" });
        queryClient.invalidateQueries({
          queryKey: ["getMerchantDetails", session?.user?.id],
        });
      },
      onError: () => {
        toast({ title: "Tambah foto album gagal!", variant: "destructive" });
      },
    });

  function onSubmit(data: TUpdateMerchantSchema) {
    updateMerchantProfile(data);
  }

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

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOnOpenDialog(false);
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileToDataUrl = await fileInputToDataURL(file);

    updateMerchantProfile({ merchantPhotoUrl: fileToDataUrl });
  };

  const onFileAlbumChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newPhotoFile = await Promise.all(
      files.map(async (file) => ({
        albumPhotoUrl: await fileInputToDataURL(file),
      }))
    );
    addAlbumPhoto({ albums: newPhotoFile });
  };

  const handleDeleteFileAlbum = (photoId?: string) => {
    if (!photoId) return;
    deleteMerchantAlbum(photoId);
  };

  useEffect(() => {
    if (session) {
      getProvince();
    }
  }, [session]);

  if (
    getMerchantDetailsloading ||
    deleteMerchantAlbumLoading ||
    updateMerchantLoadingProfile ||
    AddAlbumPhotoLoading
  ) {
    return (
      <div className="md:w-[80vw] w-screen h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="m-auto px-8 relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <DialogGeneral
            dialogContent={
              <>
                <div className="flex items-center justify-center pt-10">
                  <FormField
                    control={form.control}
                    name="merchantPhotoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <div className="border-2 border-dashed border-gray-200 rounded-lg h-[120px] w-[100px] grid place-items-center text-gray-400">
                            <FormLabel
                              className="flex flex-col items-center gap-1 hover:cursor-pointer"
                              htmlFor="images"
                            >
                              <UploadIcon className="h-6 w-6" />
                              <span className="underline text-xs underline-offset-2 underline-offset-white-0.5 transition-none p-1">
                                Click to upload
                              </span>
                              <Input
                                className="hidden "
                                id="images"
                                multiple
                                type="file"
                                onChange={(e) => {
                                  onFileChange(e);
                                  field.onChange(e);
                                  setOnOpenDialog(false);
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
                </div>
              </>
            }
            dialogTitle="Update Banner"
            onOpen={onOpenDialog}
            onOpenChange={handleOpenChange}
            dialogTrigger={
              <div
                className="relative flex flex-col gap-4 items-start max-h-[300px] pt-10 justify-end w-full hover:brightness-75 cursor-pointer"
                onClick={() => setOnOpenDialog(true)}
              >
                <Image
                  src={
                    myMerchantDetails ? myMerchantDetails?.merchantPhotoUrl : ""
                  }
                  alt={myMerchantDetails ? myMerchantDetails?.merchantName : ""}
                  width={300}
                  height={300}
                  className="object-cover w-full brightness-50 h-[300px] object-center hover:cursor-pointer pb-5 pt-10"
                />
                <div className="absolute top-10 right-0 bottom-0 left-0 flex justify-center items-center sm:opacity-0 sm:hover:opacity-100 transition-opacity">
                  <Upload className="text-white" />
                </div>
              </div>
            }
          />

          <div className="h-fit">
            <FormLabel>
              Album{" "}
              <span className="text-gray-300 italic text-xs">(maks 4)</span>
            </FormLabel>
            <div className="flex flex-col sm:flex-row w-44 h-full max-w-screen overflow-scroll mt-4 gap-4">
              <FormLabel
                htmlFor="images2"
                className="border border-dashed flex justify-center items-center h-32 cursor-pointer w-full "
              >
                <PlusIcon className="text-gray-400" />
                <Input
                  id="images2"
                  type="file"
                  className="hidden"
                  onChange={(e) => onFileAlbumChange(e)}
                />
              </FormLabel>
              {myMerchantDetails?.merchantAlbums &&
                myMerchantDetails?.merchantAlbums.length > 0 &&
                myMerchantDetails?.merchantAlbums.map((photo, index) => (
                  <div key={index} className="relative">
                    <div className="relative h-32 w-full">
                      <Image
                        src={photo.albumPhotoUrl}
                        alt={`Album photo ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                        onClick={() =>
                          handleDeleteFileAlbum(photo.merchantAlbumId)
                        }
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

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
                        ? field.value.map((value: any) => ({
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
            name="merchantProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provinsi</FormLabel>
                <FormControl>
                  <SelectOption
                    placeholder="Pilih Provinsi"
                    selectLabel={"Provinsi"}
                    selectList={provinceOptions}
                    defaultValue={myMerchantDetails?.merchantProvince}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
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
                <FormLabel className="pb-2">Kota</FormLabel>
                <FormControl>
                  <Input placeholder="Kota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" pt-8">
            {isLoaded ? (
              <>
                <Autocomplete
                  onLoad={onLoad}
                  options={options}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <Input placeholder="Enter a location" />
                </Autocomplete>
                <p className="italic text-gray-400 pt-5 text-sm">
                  geser marker untuk mendapatkan lokasi detailmu
                </p>
                <div className="w-24 h-24">
                  <MyMapComponent
                    isLoaded={isLoaded}
                    locLatLng={validLocation}
                    marker={
                      selectedLocation.lat !== null &&
                      selectedLocation.lng !== null ? (
                        <MarkerF
                          draggable
                          position={{
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lng,
                          }}
                          onClick={markerClicked}
                          onDragEnd={markerFinish}
                        />
                      ) : null
                    }
                  />
                </div>
              </>
            ) : (
              "loading..."
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MerchantDashboardProfile;
