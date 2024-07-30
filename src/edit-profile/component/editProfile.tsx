"use client";

import { Button } from "@/core/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/core/components/ui/card";
import { Camera, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DialogGeneral } from "@/core/components/general-dialog";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";
import useEditProfile from "../hooks/useEditProfiles";
import AddressForm from "@/users/components/addressForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/core/components/loader/loader";
import AddressCard from "./addressCard";
import { Input } from "@/core/components/ui/input";
import { FormLabel } from "@/core/components/ui/form";
import { fileInputToDataURL } from "@/core/lib/utils";
import { TUserModel, UpdateProfileModel } from "@/users/types";
import { toast, useToast } from "@/core/components/ui/use-toast";

interface AddressData {
  addressId: string | undefined;
  addressDetail: string | undefined;
  addressCity: string | undefined;
  addressProvince: string | undefined;
  addressZipCode: string | undefined;
}

const EditProfile = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    startEditing,
    startEditName,
    startEditPhone,
    cancelEditing,
    isEditName,
    isEditPhone,
    isEditing,
    setIsEditName,
    setIsEditPhone,
  } = useEditProfile();

  const { isLoading, data } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: () => axios.get(`/api/user/${session?.user?.id}`),
    enabled: !!session?.user?.id,
  });

  const {
    isLoading: addressLoading,
    error: fetchAddressError,
    data: userAddressData,
  } = useQuery({
    queryKey: ["userAddressData", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/user/address`).then((response) => {
        return response.data.data as AddressData;
      }),
    enabled: !!session?.user?.id,
  });

  const [step, setStep] = useState(0);
  const [view, setView] = useState<React.ReactNode | null>(null);

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const handleNext = useCallback(() => {
    setStep((prevStep) => prevStep + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setStep((prevStep) => prevStep - 1);
  }, []);

  function handleOpenChange(
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (!open) {
      setOpen(false);
    }
  }

  const initialFormValues = {
    name: data?.data.data.name,
    image: data?.data.data.image,
    phone: data?.data.data.phone,
  };

  useEffect(() => {
    let newView: React.SetStateAction<React.ReactNode> = null;
    if (session) {
      switch (step) {
        case 0:
          newView = (
            <RegisterForm
              onNext={() => handleNext()}
              isEditing={isEditing}
              isEditName={isEditName}
              isEditPhone={isEditPhone}
              initialFormValues={initialFormValues}
              handleCloseDialog={() => {
                setIsNameDialogOpen(false);
                setIsPhoneDialogOpen(false);
              }}
            />
          );
          break;
        case 1:
          newView = (
            <OTPVerification
              onPrevious={() => handlePrev()}
              onNext={() => handleNext()}
              isEditing={isEditing}
              isEditPhone={isEditPhone}
              handleCloseDialog={() => setIsPhoneDialogOpen(false)}
            />
          );
          break;
        case 2:
          newView = (
            <AddressForm
              isEditing={false}
              handleOnCloseDialog={() => {
                setIsAddressDialogOpen(false);
              }}
            />
          );
          break;
        default:
          newView = null;
      }
    }
    setView(newView);
  }, [step, isEditing, isEditPhone, isEditName]);

  const { mutate: updateUserImage, isPending: updateUserImageLoading } =
    useMutation({
      mutationFn: async (value: UpdateProfileModel) =>
        await axios.patch(`/api/user/${session?.user?.id}`, value),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user", session?.user?.id],
        });
        toast({
          title: "Update image berhasil!",
        });
        axios.get(`/api/user/${session?.user?.id}`).then((response) => {
          update({ image: response.data.data.image });
        });
      },
      onError: () => {
        toast({
          title: "Update image gagal!",
        });
      },
    });

  if (isLoading || addressLoading || updateUserImageLoading) {
    return <Loader />;
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileToDataUrl = await fileInputToDataURL(file);
    updateUserImage({
      image: fileToDataUrl,
      name: initialFormValues.name,
      phone: initialFormValues.phone,
    });
  };

  return (
    <div>
      <div className="grid place-items-center place-content-center gap-1">
        <div>
          <label htmlFor="imageProfile" className="relative ">
            <Image
              src={data?.data.data.image}
              className="aspect-square  rounded-full object-cover object-center hover:cursor-pointer hover:opacity-40"
              alt="userImage"
              width={100}
              height={100}
            />
            <Camera className="absolute top-1/2 right-1/2 hover:block hidden" />
            <Input
              type="file"
              className="hidden"
              id="imageProfile"
              onChange={(e) => onFileChange(e)}
            />
          </label>
        </div>

        <div className="flex gap-2 items-center pl-12">
          <h1 className="font-bold text-md sm:text-2xl flex gap-1 items-center">
            {data?.data.data.name}
          </h1>
          <DialogGeneral
            dialogTitle="Ubah Nama"
            onOpen={isNameDialogOpen}
            onOpenChange={(open) => handleOpenChange(open, setIsNameDialogOpen)}
            dialogContent={<>{view}</>}
            dialogTrigger={
              <Button
                variant={"ghost"}
                onClick={() => {
                  startEditing();
                  startEditName();
                  setIsNameDialogOpen(true);
                  setStep(0);
                }}
              >
                <PencilIcon className="hover:shadow-lg" size={15} />
              </Button>
            }
          />
        </div>

        <p className="text-gray-400 text-xs">{data?.data.data.email}</p>
        <div className="flex items-center justify-center gap-4 pl-14">
          <p className="text-sm sm:text-md">{data?.data.data.phone}</p>
          <DialogGeneral
            dialogTitle="Ubah Nomor Telpon"
            onOpen={isPhoneDialogOpen}
            onOpenChange={(open) =>
              handleOpenChange(open, setIsPhoneDialogOpen)
            }
            dialogContent={<>{view}</>}
            dialogTrigger={
              <Button
                variant={"ghost"}
                onClick={() => {
                  startEditing();
                  startEditPhone();
                  setIsPhoneDialogOpen(true);
                  setStep(0);
                }}
              >
                <PencilIcon className="hover:shadow-lg" size={15} />
              </Button>
            }
          />
        </div>
        {data?.data.data.phoneVerified ? (
          <div className="text-xs px-2 py-1 rounded-md text-white bg-green-500 hover:text-white hover:bg-green-500 cursor-default">
            Verified
          </div>
        ) : (
          <Link href="/register">
            <Button
              variant="outline"
              className="text-xs px-2 py-1 rounded-full text-gray-600 outline-none"
              onClick={() => cancelEditing()}
            >
              Verify now
            </Button>
          </Link>
        )}
      </div>
      <div>
        <div className="flex items-center gap-4 pt-5">
          <h2 className="text-md sm:text-xl font-bold">Alamat</h2>
          <div>
            <DialogGeneral
              dialogTitle={"Tambah Alamat"}
              dialogContent={<>{view}</>}
              onOpen={isAddressDialogOpen}
              onOpenChange={(open) =>
                handleOpenChange(open, setIsAddressDialogOpen)
              }
              dialogTrigger={
                <Card
                  className=" flex items-center  w-fit  px-2 py-1 hover:cursor-pointer dark:text-black bg-yellow-400 hover:bg-yellow-300"
                  onClick={() => {
                    setIsAddressDialogOpen(true);
                    cancelEditing();
                    setIsEditName(false);
                    setIsEditPhone(false);
                    setStep(2);
                  }}
                >
                  <PlusIcon
                    className="p-1 rounded-full hover:cursor-pointer"
                    size={20}
                  />
                  <p className="text-xs sm:text-sm ">Tambah alamat</p>
                </Card>
              }
            />
          </div>
        </div>
        <div className="flex gap-8 pt-5 flex-col lg:flex-row items-center w-full justify-evenly">
          {userAddressData &&
            Object.entries(userAddressData).map(([key, value]) => {
              return (
                <AddressCard
                  key={key}
                  addressCity={value.addressCity}
                  addressDetail={value.addressDetail}
                  addressProvince={value.addressProvince}
                  addressZipCode={value.addressZipCode}
                  addressId={value.addressId}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
