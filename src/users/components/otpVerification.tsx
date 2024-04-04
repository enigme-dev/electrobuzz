"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
interface OTPProps {
  onNext: Function;
  onPrevious: Function;
}
const OTPVerification = ({ onNext, onPrevious }: OTPProps) => {
  function onSubmitOTP(OTPvalues: VerifyOTPModel) {
    onNext();
  }

  const OTPform = useForm<VerifyOTPModel>({
    resolver: zodResolver(VerifyOTPSchema),
  });

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
                <FormDescription>One-time password sent to</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-5">
            <Button onClick={() => onPrevious()}>Back</Button>
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
