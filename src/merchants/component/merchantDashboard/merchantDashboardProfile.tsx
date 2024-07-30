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
  ImageIcon,
  MapPin,
  PlusIcon,
  Search,
  SquareArrowOutUpRight,
  UploadIcon,
  User,
  XIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { getData } from "@/core/lib/service";
import { SelectOption } from "@/core/components/select-option";
import {
  TBenefitType,
  TMerchantBenefitModel,
  TMerchantModel,
  TUpdateMerchantSchema,
  UpdateMerchantSchema,
} from "@/merchants/types";
import MyMapComponent from "@/core/components/google-maps";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { Switch } from "@/core/components/ui/switch";
import { Separator } from "@/core/components/ui/separator";
import { Button } from "@/core/components/ui/button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

export interface MerchantAlbum {
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
  Profile = "Profil",
  Location = "Lokasi",
  Album = "Album",
}

export type TProvinceResult = {
  item: string;
  value: string;
  id: string;
};

const experience = [
  { item: "Kurang dari 1 tahun", value: "Kurang dari 1 tahun" },
  { item: "1 - 3 tahun", value: "1 - 3 tahun" },
  { item: "3 - 5 tahun", value: "3 - 5 tahun" },
  { item: "5 - 10 tahun", value: "5 - 10 tahun" },
  { item: "Lebih dari 10 tahun", value: "Lebih dari 10 tahun" },
];

const warranty = [
  { item: "Tidak ada garansi", value: "Tidak ada garansi" },
  { item: "7 Hari", value: "7 Hari" },
  { item: "14 Hari", value: "14 Hari" },
  { item: "30 Hari", value: "30 Hari" },
  { item: "2 Bulan", value: "2 Bulan" },
  { item: "3 Bulan", value: "3 Bulan" },
  { item: "6 Bulan", value: "6 Bulan" },
];

const serviceTypes = [
  { item: "Drop-In", value: "Drop-In" },
  { item: "Home Service", value: "Home Service" },
];

const libraries: LoadScriptProps["libraries"] = ["places"];

const MerchantDashboardProfile = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

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
  const { data: myMerchantBenefits } = useQuery({
    queryKey: ["getMerchantBenefits", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/${session?.user?.id}`).then((response) => {
        return response.data.data.benefits as TMerchantBenefitModel[];
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
  const [provinceOptions, setProvinceOptions] = useState<TProvinceResult[]>([]);
  const [cityOptions, setCityOptions] = useState([]);
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
    if (selectedLocation.lat !== null && selectedLocation.lng !== null) {
      form.setValue("merchantLat", selectedLocation.lat);
      form.setValue("merchantLong", selectedLocation.lng);
    }
  }, [form, selectedLocation]);

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

  async function getProvince(): Promise<TProvinceResult[]> {
    return new Promise((resolve, reject) => {
      getData("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then((res) => {
          const provinceOptions: TProvinceResult[] = res.map(
            (province: any) => ({
              item: province.name,
              value: province.name,
              id: province.id,
            })
          );
          setProvinceOptions(provinceOptions);
          resolve(provinceOptions);
        })
        .catch(() => reject("error"));
    });
  }

  const getProvinceByName = (list: TProvinceResult[], name: string) => {
    const result = list.filter(
      (province: TProvinceResult) => name === province.value
    );

    return result;
  };

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

  const handleValueChange = (type: TBenefitType, value: string) => {
    updateMerchantProfile({
      benefits: [
        {
          benefitType: type,
          benefitBody: value,
        },
      ],
    });
  };

  useEffect(() => {
    if (session) {
      getProvince().then((res) => {
        const currentProvince = getProvinceByName(
          res,
          myMerchantDetails?.merchantProvince || ""
        );

        if (currentProvince.length > 0) {
          getCityLocation(currentProvince[0].id);
        }
      });
    }
  }, [session, myMerchantDetails]);

  if (
    getMerchantDetailsloading ||
    deleteMerchantAlbumLoading ||
    AddAlbumPhotoLoading ||
    getMerchantAlbumsloading ||
    status === "loading"
  ) {
    return (
      <div className="md:w-[80vw] w-screen h-full">
        <Loader />
      </div>
    );
  }

  const getBenefits = (type: string) => {
    if (myMerchantBenefits) {
      const result = myMerchantBenefits.filter(
        (benefit) => benefit.benefitType === type
      );
      if (result.length === 1) {
        return result[0];
      }
    }
  };

  return (
    <div className="px-4 sm:px-8 w-screen lg:w-full pb-20">
      <h1 className="mt-6 my-4 font-bold text-2xl">Profile Mitra</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-4 flex-col sm:flex-row"
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
              *.jpeg, *.jpg, *.png, *.webp
            </FormDescription>
            <div className="flex justify-around pt-10">
              <FormField
                control={form.control}
                name="merchantAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available</FormLabel>
                      <FormDescription>
                        Tekan tombol ke kanan jika kamu sedang aktif dan tekan
                        tombol ke kiri jika kamu sedang tidak aktif
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        defaultChecked={myMerchantDetails?.merchantAvailable}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateMerchantProfile({ merchantAvailable: true });
                          } else {
                            updateMerchantProfile({ merchantAvailable: false });
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow-md space-y-4 w-full">
            <div className="flex sm:gap-4">
              {Object.values(Tab).map((tab) => (
                <Button
                  variant={"ghost"}
                  key={tab}
                  type="button"
                  className={`text-sm sm:text-lg  ${
                    activeTab === tab ? "bg-accent" : ""
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab === Tab.Profile && <User size={18} className="mr-2" />}
                  {tab === Tab.Location && (
                    <MapPin size={18} className="mr-2" />
                  )}
                  {tab === Tab.Album && (
                    <ImageIcon size={18} className="mr-2" />
                  )}
                  {tab}
                </Button>
              ))}
              <div className="grow"></div>
              <Button variant="ghost" asChild>
                <Link href={`/merchant/${myMerchantDetails?.merchantId}`}>
                  <SquareArrowOutUpRight size={15} />
                </Link>
              </Button>
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Pengalaman</FormLabel>
                    <SelectOption
                      selectList={experience}
                      defaultValue={
                        getBenefits("experience")
                          ? getBenefits("experience")?.benefitBody
                          : ""
                      }
                      onValueChange={(value) =>
                        handleValueChange("experience", value)
                      }
                      placeholder="Pilih Pengalaman"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Garansi</FormLabel>
                    <SelectOption
                      selectList={warranty}
                      defaultValue={
                        getBenefits("warranty")
                          ? getBenefits("warranty")?.benefitBody
                          : ""
                      }
                      onValueChange={(value) =>
                        handleValueChange("warranty", value)
                      }
                      placeholder="Pilih Kebijakan Garansi"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Tipe Layanan Servis</FormLabel>
                    <SelectOption
                      selectList={serviceTypes}
                      defaultValue={
                        getBenefits("service_type")
                          ? getBenefits("service_type")?.benefitBody
                          : ""
                      }
                      onValueChange={(value) =>
                        handleValueChange("service_type", value)
                      }
                      placeholder="Pilih Tipe Layanan Servis"
                    />
                  </div>
                </div>

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
                      <FormDescription className="italic">
                        * isi sesuai dengan keahlianmu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="merchantDesc"
                  render={({ field }) => {
                    const plainText = field.value
                      ? field.value.replace(/<[^>]+>/g, "")
                      : "";
                    const plainTextLength = plainText.trim().length;

                    return (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={{
                              toolbar: [
                                [{ header: [2, false] }],
                                ["bold", "italic", "underline"],
                                [{ list: "ordered" }, { list: "bullet" }],
                              ],
                            }}
                          />
                        </FormControl>
                        <FormDescription
                          className={`text-sm ${
                            plainTextLength < 32 ? "text-destructive" : ""
                          }`}
                        >
                          {plainTextLength}/1200 karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="w-full flex justify-end pt-10">
                  <ButtonWithLoader
                    buttonText="Simpan"
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
              <div className="space-y-4">
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
                            getCityLocation(
                              getProvinceByName(provinceOptions, value)[0].id
                            );
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
                      <FormLabel>Kota</FormLabel>
                      <FormControl>
                        <SelectOption
                          placeholder="Pilih Kota"
                          selectList={cityOptions}
                          defaultValue={myMerchantDetails?.merchantCity}
                          onValueChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-8">
                  {isLoaded ? (
                    <>
                      <Autocomplete
                        onLoad={onLoad}
                        options={options}
                        onPlaceChanged={handlePlaceChanged}
                      >
                        <div className="grow flex items-center gap-2 h-10 rounded-md border bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <Search size={18} className="text-slate-500" />
                          <input
                            type="text"
                            placeholder="Cari nama tempat..."
                            className="w-full text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none"
                          />
                        </div>
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
                </div>
                <div className="w-full flex justify-end pt-10">
                  <ButtonWithLoader
                    buttonText="Simpan"
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
