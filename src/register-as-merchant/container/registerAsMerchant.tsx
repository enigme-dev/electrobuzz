"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RegisterAsMerchantStart from "../component/registerAsMerchantStart";
import RegisterAsMerchantForm from "../component/registerAsMerchantForm";
import RegisterAsMerchantTermsAndConditions from "../component/registerAsMerchantTermsAndConditions";

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
        setView(<RegisterAsMerchantStart onNext={() => handleNext()} />);
        break;
      case 1:
        setView(
          <RegisterAsMerchantTermsAndConditions
            onPrevious={() => handlePrev()}
            onNext={() => handleNext()}
          />
        );
        break;
      case 2:
        setView(
          <RegisterAsMerchantForm
            onPrevious={() => handlePrev()}
            onNext={() => handleNext()}
          />
        );
        break;
    }
  }, [step]);

  return <div>{view}</div>;
}
