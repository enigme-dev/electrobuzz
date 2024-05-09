"use client";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getData, updateData } from "@/core/lib/service";
import { hostname } from "os";
import { UpdateProfileModel, UpdateProfileSchema } from "@/users/types";
import Image from "next/image";
import { Card, CardContent } from "@/core/components/ui/card";
import { MapPinIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { DialogGeneral } from "@/core/components/general-dialog";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";

const EditProfileForm = () => {
  const { data: session } = useSession();

  const [userData, setUserData] = useState({
    data: {
      image: "",
      name: "",
      email: "",
      phone: "",
      phoneVerified: "",
    },
  });

  const [step, setStep] = useState(0);
  const [view, setView] = useState(<></>);
  const labels = ["Data Diri", "Verifikasi Nomor Telepon", "Alamat"];

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step < labels.length - 1) setStep((prev) => prev + 1);
  };
  useEffect(() => {
    async function getUserData() {
      const response = await getData(`/api/user/${session?.user?.id}`);
      setUserData(response);
    }
    if (session?.user) {
      getUserData();
    }
  }, [session]);

  useEffect(() => {
    switch (step) {
      case 0:
        setView(<RegisterForm onNext={() => handleNext()} />);
        break;
      case 1:
        setView(
          <OTPVerification
            onPrevious={() => handlePrev()}
            onNext={() => handleNext()}
          />
        );
        break;
    }
  }, [step]);

  return (
    <div>
      <div className="grid place-items-center place-content-center gap-1">
        <div>
          <Image
            src={userData.data.image}
            className="aspect-square rounded-full"
            alt="userImage"
            width={100}
            height={100}
          />
        </div>
        <div className="flex gap-2 items-center pl-5">
          <h1 className="font-bold text-md sm:text-2xl flex gap-1 items-center">
            {userData.data.name}
          </h1>
          <DialogGeneral
            dialogTitle="Edit Profile"
            dialogContent={<>{view}</>}
            dialogTrigger={<PencilIcon size={15} className="w-2 sm:w-4" />}
          />
        </div>

        <p className="text-gray-400 text-xs">{userData.data.email}</p>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm sm:text-md">{userData.data.phone}</p>

          {userData.data.phoneVerified ? (
            <Button
              variant="outline"
              className="text-xs px-2 rounded-full text-white bg-green-500 hover:text-white hover:bg-green-500 cursor-default"
            >
              Verified
            </Button>
          ) : (
            <Link href="/register">
              <Button
                variant="outline"
                className="text-xs px-2 py-1 rounded-full text-gray-600 outline-none"
              >
                Verify now
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div>
        <div className="grid gap-4 pt-5">
          <h2 className="text-md sm:text-xl font-bold">Alamat</h2>
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
      </div>
    </div>
  );
};

export default EditProfileForm;
