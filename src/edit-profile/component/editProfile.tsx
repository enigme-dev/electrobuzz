"use client";
import { Button } from "@/core/components/ui/button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card } from "@/core/components/ui/card";
import { PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DialogGeneral } from "@/core/components/general-dialog";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";
import useEditProfile from "../hooks/useEditProfiles";
import AddressForm from "@/users/components/addressForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/core/components/loader";
import AddressCard from "./addressCard";

interface AddressData {
  addressId: string | undefined;
  addressDetail: string | undefined;
  addressCity: string | undefined;
  addressProvince: string | undefined;
  addressZipCode: string | undefined;
}

const EditProfile = () => {
  const { data: session, update } = useSession();
  const {
    startEditing,
    startEditName,
    startEditPhone,
    cancelEditing,
    isEditName,
    isEditPhone,
    isEditing,
    onOpenDialog,
    setOnOpenDialog,
    setIsEditName,
    setIsEditPhone,
  } = useEditProfile();

  const { isLoading: isLoading, data } = useQuery({
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

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step < 1) setStep((prev) => prev + 1);
  };

  function handleOpenChange(open: boolean) {
    if (!open) {
      setStep(0);
      setOnOpenDialog(false);
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
              handleCloseDialog={() => setOnOpenDialog(false)}
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
              handleCloseDialog={() => setOnOpenDialog(false)}
            />
          );
          break;
        case 2:
          newView = (
            <AddressForm
              isEditing={false}
              handleOnCloseDialog={() => setOnOpenDialog(false)}
            />
          );
          break;
        default:
          newView = null;
      }
    }
    setView(newView);
  }, [step, isEditing, isEditPhone, isEditName, onOpenDialog]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="grid place-items-center place-content-center gap-1">
        <div>
          <Image
            src={data?.data.data.image}
            className="aspect-square rounded-full"
            alt="userImage"
            width={100}
            height={100}
          />
        </div>

        <div className="flex gap-2 items-center pl-12">
          <h1 className="font-bold text-md sm:text-2xl flex gap-1 items-center">
            {data?.data.data.name}
          </h1>
          <DialogGeneral
            dialogTitle="Edit Profile"
            onOpen={onOpenDialog}
            onOpenChange={handleOpenChange}
            dialogContent={<>{view}</>}
            dialogTrigger={
              <Button
                variant={"ghost"}
                onClick={() => {
                  startEditing();
                  startEditName();
                  setOnOpenDialog(true);
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
            dialogTitle="Edit Profile"
            onOpen={onOpenDialog}
            onOpenChange={handleOpenChange}
            dialogContent={<>{view}</>}
            dialogTrigger={
              <Button
                variant={"ghost"}
                onClick={() => {
                  startEditing();
                  startEditPhone();
                  setOnOpenDialog(true);
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
              dialogTitle={"Add Address"}
              dialogContent={<>{view}</>}
              onOpen={onOpenDialog}
              onOpenChange={handleOpenChange}
              dialogTrigger={
                <Card
                  className="rounded-full w-fit block"
                  onClick={() => cancelEditing()}
                >
                  <PlusIcon
                    className="p-1 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                    size={30}
                    onClick={() => {
                      setOnOpenDialog(true);
                      cancelEditing();
                      setIsEditName(false);
                      setIsEditPhone(false);
                      setStep(2);
                    }}
                  />
                </Card>
              }
            />
          </div>
        </div>
        <div className="flex gap-8 pt-5 flex-col lg:flex-row items-center w-full justify-evenly">
          {userAddressData &&
            Object.entries(userAddressData).map(([key, value], index) => {
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
