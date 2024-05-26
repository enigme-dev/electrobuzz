"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { ReactNode, useEffect, useState } from "react";
import { BookingReasonSchema, TBookingReasonSchema } from "@/bookings/types";
import ButtonWithLoader from "./buttonWithLoader";

interface RadioGroupProps {
  options: { option: string; label?: string }[];
  defaultValue: string;
  onSubmitRadio: (value: any) => void;
  onSubmitLoading: boolean;
}

export function RadioGroupForm({
  options,
  defaultValue,
  onSubmitLoading,
  onSubmitRadio,
}: RadioGroupProps) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const form = useForm<TBookingReasonSchema>({
    resolver: zodResolver(BookingReasonSchema),
  });
  useEffect(() => {
    if (form) {
      form.setValue("bookingReason", defaultValue);
    }
  }, [defaultValue, form]);

  function onSubmit(data: TBookingReasonSchema) {
    onSubmitRadio(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="bookingReason"
          render={({ field }) => (
            <FormItem className="space-y-3 pt-5">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedOption(value);
                  }}
                  defaultValue={selectedOption}
                  className="flex flex-col space-y-1"
                >
                  {options.map((option, index) => (
                    <FormItem
                      key={index}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={option.option}
                          defaultChecked={option.option === selectedOption}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              {selectedOption === "" && (
                <>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Detail alasanmu"
                      className="mt-2 p-2 border rounded"
                      {...field}
                      onChange={(e) =>
                        form.setValue("bookingReason", e.target.value)
                      }
                    />
                  </FormControl>
                </>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <ButtonWithLoader
            buttonText="Submit"
            className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
            isLoading={onSubmitLoading}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
}
