"use client";
import { Button } from "@/core/components/ui/button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getData, updateData } from "@/core/lib/service";
import Image from "next/image";
import { Card, CardContent } from "@/core/components/ui/card";
import { MapPinIcon, PencilIcon, PlusCircleIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DialogGeneral } from "@/core/components/general-dialog";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";
import useEditProfile from "../hooks/useEditProfiles";
import AddressForm from "@/users/components/addressForm";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/core/components/loader";
import { useToast } from "@/core/components/ui/use-toast";

const EditProfileForm = () => {
  const { data: session } = useSession();
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
  } = useEditProfile();

  const {
    isLoading: isLoading,
    error,
    data,
    refetch,
  } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: () => axios.get(`/api//user/${session?.user?.id}`),
    enabled: !!session?.user?.id,
  });

  console.log(data?.data.data.name);

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
        <h2 className="text-md sm:text-xl font-bold">Alamat</h2>
        <div className="grid gap-4 pt-5 lg:grid-cols-3">
          <div className="flex gap-2 w-full items-center">
            <p className="font-bold text-xl">1.</p>
            <Card className="p-5 w-full flex items-center gap-4 sm:gap-10">
              <MapPinIcon />
              <CardContent className="p-0 text-sm">
                <p>Villa Pasimas Blok A no.23</p>
                <p>Bogor Jawa Barat</p>
                <p>16119</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <DialogGeneral
            dialogTitle={isEditing ? "Edit Address" : "Add Address"}
            dialogContent={
              <>
                <AddressForm isEditing={isEditing} onPrevious={() => {}} />
              </>
            }
            dialogTrigger={
              <Card
                className="rounded-full w-fit"
                onClick={() => startEditing()}
              >
                <PlusIcon
                  className="p-3 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                  size={50}
                />
              </Card>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
