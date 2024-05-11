"use client";

import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import React, { useEffect, useState } from "react";

import Stepper from "@/core/components/stepper";
import RegisterForm from "@/users/components/registerForm";
import OTPVerification from "@/users/components/otpVerification";
import AddressForm from "@/users/components/addressForm";

export default function Page() {
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
        setView(
          <RegisterForm
            onNext={() => handleNext()}
            handleCloseDialog={() => {}}
          />
        );
        break;
      case 1:
        setView(
          <OTPVerification
            onPrevious={() => handlePrev()}
            onNext={() => handleNext()}
            isEditPhone={false}
            isEditing={false}
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
