"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { VerifyOTPModel, VerifyOTPSchema } from "../types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/core/components/ui/input-otp";
import { Button } from "@/core/components/ui/button";
import { useForm } from "react-hook-form";
import { getData, postData } from "@/core/lib/service";
import { useToast } from "@/core/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useCountdown } from "@/core/hooks/useCountdown";
import { error, time } from "console";
import { useSession } from "next-auth/react";

interface OTPProps {
  onNext: Function;
  onPrevious: Function;
  isEditing?: boolean;
  isEditPhone?: boolean;
  initialOTPFormValue: { verifId: string; code: string };
}
const OTPVerification = ({
  onNext,
  onPrevious,
  initialOTPFormValue,
}: OTPProps) => {
  const { countdown, setIsCountdown, isCountdown, setCountdown } =
    useCountdown();

  const { toast } = useToast();

  const OTPform = useForm<VerifyOTPModel>({
    resolver: zodResolver(VerifyOTPSchema),
    defaultValues: {
      code: "",
      verifId: "",
    },
  });
  const [verifId, setVerifId] = useState("");
  async function handleCountdown(response: any) {
    console.log(response);
    const givenTime = new Date(response.data.data);
    if (response.status === 429) {
      const currentTime = new Date();
      console.log({ givenTime: givenTime, currentTime: currentTime });
      const timeDifference = givenTime.getTime() - currentTime.getTime();
      const minutesDifference = Math.floor(timeDifference / 1000);
      console.log(minutesDifference);
      setCountdown(minutesDifference);
      setIsCountdown(true);
    }
  }

  async function getOTP() {
    try {
      const response = await getData(`/api/user/otp`);
      setVerifId(response.data.verifId);
      console.log(response);
      handleCountdown(response);
      handleError(response);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(verifId);

  function handleError(error: any) {
    switch (error.response.data.status) {
      case "ErrOTPIncorrect":
        toast({
          title: "OTP yang anda masukan salah",
          variant: "destructive",
        });
        break;
      case "ErrOTPExpired":
        toast({
          title: "OTP anda telah expired",
          variant: "destructive",
        });
        break;
      case "ErrUnknown":
        toast({
          title: "Server unavailable",
          variant: "destructive",
        });
        break;
      case "ErrOTPVerified":
        toast({
          title: "Kamu sudah terverifikasi",
          variant: "default",
        });
        break;
      case "ErrOTPNotFound":
        toast({
          title:
            "OTP Tidak ditemukan, Mohon klik 'Get Code' untuk mendapatkan kode ",
          variant: "destructive",
        });
        break;
      case "ErrOTPNotRegistered":
        toast({
          title: "Nomor HP belum terdaftar",
          variant: "destructive",
        });
        break;
      default:
    }
  }

  function onSubmitOTP(OTPvalues: VerifyOTPModel) {
    try {
      console.log("test");
      checkOTPValid(OTPvalues);
    } catch (error) {
      console.error(error);
    }
  }

  async function checkOTPValid(values: VerifyOTPModel) {
    await axios
      .post("/api/user/otp", values)
      .then((response) => {
        console.log(response);
        if (response.data.status === "phone verified successfully") {
          onNext();
        }
      })
      .catch((error) => {
        console.log(error.response.status);
        console.log(error.response.data.data);
        console.log(error.response.data.status);

        if (error.response.status > 200) handleError(error);
      });
  }

  return (
    <div>
      <Form {...OTPform}>
        <form
          onSubmit={OTPform.handleSubmit(onSubmitOTP)}
          className=" space-y-6"
        >
          <FormField
            control={OTPform.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {new Array(6).fill(0).map((_, i) => (
                        <InputOTPSlot index={i} key={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      getOTP();
                    }}
                    className="flex gap-5 active:no-underline hover:no-underline"
                    disabled={isCountdown}
                  >
                    Get Code
                    <div className={countdown === 0 ? "hidden" : "block"}>
                      {" "}
                      {countdown > 0 ? (
                        <p className="text-gray-400 text-xs">
                          Time remaining: {Math.floor(countdown / 60)}:
                          {countdown % 60 < 10 ? "0" : ""}
                          {countdown % 60}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-5">
            <Button onClick={() => onPrevious()} type="button">
              Back
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="hover:shadow-md hover:shadow-yellow-200 transition duration-500 "
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
