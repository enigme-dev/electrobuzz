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
import { useCallback, useEffect, useRef, useState } from "react";
import MyMapComponent from "@/core/components/google-maps";
import {
  Autocomplete,
  LoadScriptProps,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getData } from "@/core/lib/service";
import { SelectOption } from "@/core/components/select-option";
import { useSession } from "next-auth/react";

interface RegisterAsMerchantFormProps {
  onNext: Function;
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
const RegisterAsMerchantForm = ({ onNext }: RegisterAsMerchantFormProps) => {
  const { update } = useSession();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<latLng>({
    lat: null,
    lng: null,
  });
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

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
    lat: -6.2,
    lng: 106.816666,
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
    if (selectedLocation.lat !== null && selectedLocation.lng !== null) {
      form.setValue("merchantLat", selectedLocation.lat);
      form.setValue("merchantLong", selectedLocation.lng);
    }
  }, [selectedLocation]);

  const form = useForm<TRegisterMerchantSchema>({
    resolver: zodResolver(RegisterMerchantSchema),
  });

  const { mutate: addMerchantData, isPending: updateLoading } = useMutation({
    mutationFn: (values: TRegisterMerchantSchema) =>
      axios.post(`/api/merchant`, values),
    onSuccess: () => {
      toast({
        title: "Formulir anda telah terkirim!",
        description: "mohon menunggu konfirmasi admin",
      });
      update({
        isMerchant: true,
      });
    },
  });

  function onSubmit(data: TRegisterMerchantSchema) {
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

  function getCityByProvinceId(value?: {
    item: string;
    value: string;
    id?: string;
  }) {
    const selectedValue: any = provinceOptions.filter((item: any) => {
      return item.value === value;
    });
    if (selectedValue.length > 0) {
      const id = selectedValue[0].id;
      getCityLocation(id);
    } else {
      return undefined;
    }
  }

  useEffect(() => {
    if (form) {
      getProvince();
      getCityLocation();
    }
  }, [form]);

  if (!isLoaded) {
    return null;
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
                <div className="pt-5 flex-col justify-between md:flex ">
                  <div>
                    <h1 className="pb-2 font-semibold">Provinsi</h1>
                    <FormControl>
                      <SelectOption
                        placeholder="Pilih Provinsi"
                        selectLabel={"Provinsi"}
                        selectList={provinceOptions}
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          getCityByProvinceId(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchantCity"
            render={({ field }) => (
              <FormItem>
                <div className="pt-5 flex-col justify-between md:flex ">
                  <div>
                    <h1 className="pb-2 font-semibold">Kota</h1>
                    <FormControl>
                      <SelectOption
                        placeholder="Pilih Kota"
                        selectLabel={"Kota"}
                        selectList={cityOptions}
                        defaultValue={undefined}
                        onValueChange={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-start justify-start gap-10 flex-col-reverse sm:flex-row">
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="merchantLat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lat</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Lat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchantLong"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lng</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Lng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-8">
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
              <div>
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
            </div>
          </div>
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
