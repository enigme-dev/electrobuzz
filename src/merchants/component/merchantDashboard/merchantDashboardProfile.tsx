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
import {
  Camera,
  PlusIcon,
  Settings,
  Upload,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { getData } from "@/core/lib/service";
import { SelectOption } from "@/core/components/select-option";
import { DialogGeneral } from "@/core/components/general-dialog";
import {
  TMerchantIdentityModel,
  TMerchantModel,
  TUpdateMerchantSchema,
  UpdateMerchantSchema,
} from "@/merchants/types";
import MyMapComponent from "@/core/components/google-maps";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { Switch } from "@/core/components/ui/switch";
import { Separator } from "@/core/components/ui/separator";
import { Button } from "@/core/components/ui/button";

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

export enum Tab {
  Profile = "Profile",
  Location = "Location",
  Album = "Album",
}

const libraries: LoadScriptProps["libraries"] = ["places"];

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
            return response.data.data as TMerchantModel;
          }),
      enabled: !!session?.user?.id,
    });

  const { isLoading: getMerchantAlbumsloading, data: merchantAlbums } =
    useQuery({
      queryKey: ["getMerchantAlbum", session?.user?.id],
      queryFn: async () =>
        await axios
          .get(`/api/merchant/${session?.user?.id}`)
          .then((response) => {
            return response.data.data.merchantAlbums as MerchantAlbum[];
          }),
      enabled: !!session?.user?.id,
    });

  const [selectedLocation, setSelectedLocation] = useState<latLng>({
    lat: myMerchantDetails?.merchantLat || null,
    lng: myMerchantDetails?.merchantLong || null,
  });
  const [provinceOptions, setProvinceOptions] = useState([]);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Profile);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
          queryKey: ["getMerchantAlbum", session?.user?.id],
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
          queryKey: ["getMerchantAlbum", session?.user?.id],
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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileToDataUrl = await fileInputToDataURL(file);

    updateMerchantProfile({ merchantPhotoUrl: fileToDataUrl });
  };

  const onBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileToDataUrl = await fileInputToDataURL(file);

    updateMerchantProfile({ merchantBanner: fileToDataUrl });
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
    AddAlbumPhotoLoading ||
    getMerchantAlbumsloading
  ) {
    return (
      <div className="md:w-[80vw] w-screen h-full">
        <Loader />
      </div>
    );
  }

  console.log(myMerchantDetails);
  console.log(merchantAlbums);

  return (
    <div className="p-8 w-screen lg:w-full pb-20">
      <h1 className="font-bold text-lg sm:text-2xl">Profile Mitra</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-4 pt-10 flex-col sm:flex-row"
        >
          <div className="border rounded-lg shadow-md w-full sm:w-[40vw]">
            <label
              htmlFor="imageBanner"
              className="relative flex flex-col gap-4 items-start max-h-[300px] justify-end w-full cursor-pointer group"
            >
              <Image
                src={
                  myMerchantDetails && myMerchantDetails.merchantBanner
                    ? myMerchantDetails.merchantBanner
                    : ""
                }
                alt={myMerchantDetails ? myMerchantDetails.merchantName : ""}
                width={300}
                height={300}
                className="object-cover rounded-t-lg w-full h-[300px] object-center brightness-50"
              />
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-t-lg"></div>
              <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UploadIcon className="text-white" />
              </div>
              <Input
                type="file"
                className="hidden"
                id="imageBanner"
                onChange={(e) => onBannerFileChange(e)}
              />
            </label>

            <div className="flex justify-center mt-[-60px]">
              <label
                htmlFor="imageProfile"
                className="relative border border-dashed rounded-full p-3 cursor-pointer group"
              >
                <Image
                  src={
                    myMerchantDetails ? myMerchantDetails.merchantPhotoUrl : ""
                  }
                  className="aspect-square rounded-full object-cover object-center"
                  alt="userImage"
                  width={100}
                  height={100}
                />
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
                <Camera className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <Input
                  type="file"
                  className="hidden"
                  id="imageProfile"
                  onChange={(e) => onFileChange(e)}
                />
              </label>
            </div>
            <FormDescription className="text-gray-400 text-center">
              *.jpeg, *.jpg, *.png
            </FormDescription>
            <div className="flex justify-around pt-10">
              <h2>Aktif</h2>
              <div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="border p-8 rounded-lg shadow-md space-y-4 w-full">
            <div className="flex sm:gap-4">
              {Object.values(Tab).map((tab) => (
                <Button
                  variant={"ghost"}
                  key={tab}
                  type="button"
                  className={`text-sm sm:text-lg  ${
                    activeTab === tab ? "bg-accent" : "text-black"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            <Separator />
            {activeTab === Tab.Profile && (
              <div className="space-y-4">
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
                <div className="w-full flex justify-end pt-10">
                  <ButtonWithLoader
                    buttonText="Save Changes"
                    type="submit"
                    className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
                    isLoading={updateMerchantLoadingProfile}
                  />
                </div>
              </div>
            )}
            {activeTab === Tab.Album && (
              <div className="h-fit">
                <FormLabel>
                  Album{" "}
                  <span className="text-gray-300 italic text-xs">(maks 4)</span>
                </FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 w-full h-full mt-4 gap-4">
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
                  {merchantAlbums &&
                    merchantAlbums.length > 0 &&
                    merchantAlbums.map((photo: any, index: any) => (
                      <div key={index} className="relative">
                        <div className="relative grid grid-cols-3 h-32 w-full">
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
            )}
            {activeTab === Tab.Location && (
              <div className="pt-8">
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
                    <div className="relative">
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
                <div className="w-full flex justify-end pt-10">
                  <ButtonWithLoader
                    buttonText="Save Changes"
                    type="submit"
                    className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
                    isLoading={updateMerchantLoadingProfile}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MerchantDashboardProfile;
