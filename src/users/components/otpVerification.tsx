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
import { useToast } from "@/core/components/ui/use-toast";
import axios from "axios";
import { useCountdown } from "@/core/hooks/useCountdown";

import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface OTPProps {
  onNext: Function;
  onPrevious: Function;
  isEditing?: boolean;
  isEditPhone?: boolean;
  handleCloseDialog?: Function;
}
const OTPVerification = ({
  onNext,
  onPrevious,
  handleCloseDialog,
  isEditing,
}: OTPProps) => {
  const { countdown, setIsCountdown, isCountdown, setCountdown } =
    useCountdown();
  const { data: session } = useSession();
  const [verifId, setVerifId] = useLocalStorage("verifId", "");
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const OTPform = useForm<VerifyOTPModel>({
    resolver: zodResolver(VerifyOTPSchema),
    defaultValues: {
      code: "",
      verifId: "",
    },
  });

  const { mutate: updateNumberStatus, isPending: updateLoading } = useMutation({
    mutationFn: () => axios.get(`/api//user/${session?.user?.id}`),
    onSuccess: () => {
      toast({ title: "Verifikasi Berhasil!" });
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
    },
  });

  async function handleCountdown(response: any) {
    setIsCountdown(true);

    let expiredTime;

    if (
      response &&
      response.data &&
      response.data.data &&
      response.data.data.expiredAt
    ) {
      expiredTime = new Date(response.data.data.expiredAt);
    } else if (
      response &&
      response.response &&
      response.response.data &&
      response.response.data.data &&
      response.response.data.data.expiredAt
    ) {
      expiredTime = new Date(response.response.data.data.expiredAt);
    } else {
      console.error("Invalid response format");
      return;
    }

    const currentTime = new Date();

    const timeDifference = expiredTime.getTime() - currentTime.getTime();
    const minutesDifference = Math.floor(timeDifference / 1000);
    setCountdown(minutesDifference);
  }

  async function getOTP() {
    await axios
      .get(`/api/user/otp`)
      .then((response) => {
        handleCountdown(response);
        setVerifId(response.data.data.verifId);
      })
      .catch((error) => {
        handleCountdown(error);
        handleError(error);
      });
  }

  useEffect(() => {
    OTPform.setValue("verifId", verifId);
  }, [verifId, OTPform]);

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
      case "ErrOTPUnknown":
        toast({
          title: "OTP Tidak dikenal",
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
      case "ErrTooManyRequest":
        toast({
          title: "Mohon menunggu selama 2 menit",
          variant: "destructive",
        });
        break;
      default:
    }
  }

  function onSubmitOTP(OTPvalues: VerifyOTPModel) {
    try {
      checkOTPValid(OTPvalues);
    } catch (error) {
      console.error(error);
    }
  }

  async function checkOTPValid(values: VerifyOTPModel) {
    await axios
      .post("/api/user/otp", values)
      .then((response) => {
        if (response.data.status === "phone verified successfully") {
          onNext();
          if (isEditing) {
            if (handleCloseDialog) {
              handleCloseDialog();
            }
            updateNumberStatus();
          }
        }
      })
      .catch((error) => {
        handleError(error);
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
                    onClick={() => getOTP()}
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
