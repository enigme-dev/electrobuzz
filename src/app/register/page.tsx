"use client";

import { Button } from "@/core/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
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
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/core/components/ui/input-otp";
import {
  UpdateProfileModel,
  UpdateProfileSchema,
  VerifyOTPModel,
  VerifyOTPSchema,
} from "@/users/types";
import { AddressModel, AddressSchema } from "@/addresses/types";
import Stepper from "@/core/components/stepper";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";
import AddressForm from "@/users/components/addressForm";

export default function Page() {
  const { data: session } = useSession();

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
      case 2:
        setView(<AddressForm onPrevious={() => handlePrev()} />);
        break;
    }
  }, [step]);

  return (
    <div className="wrapper px-10 py-20 w-fit ">
      <Card>
        {" "}
        <CardHeader>
          <h1 className="font-bold text-lg">Form Pengguna Baru</h1>
        </CardHeader>
        <CardContent>
          <Stepper activeStep={step} labels={labels} />
          {view}
        </CardContent>
      </Card>
    </div>
  );
}
