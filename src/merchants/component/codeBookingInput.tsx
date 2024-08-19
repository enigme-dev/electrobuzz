import {
  CheckBookingCodeSchema,
  TCheckBookingCodeSchema,
} from "@/bookings/types";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import { Button } from "@/core/components/ui/button";
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
import { useToast } from "@/core/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const CodeBookingInput = ({ bookingId }: { bookingId: string }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const OTPform = useForm<TCheckBookingCodeSchema>({
    resolver: zodResolver(CheckBookingCodeSchema),
  });

  const { mutate: checkCodeValid, isPending: updateLoading } = useMutation({
    mutationFn: (value: TCheckBookingCodeSchema) =>
      axios.patch(`/api/merchant/booking/${bookingId}/edit/in_progress`, value),
    onSuccess: () => {
      toast({ title: "Verifikasi Berhasil!" });
      queryClient.invalidateQueries({
        queryKey: ["getBookingDetailData", session?.user?.id],
      });
    },
    onError: (error: any) => {
      if (error.response.data.status === "ErrBookWrongSchedule")
        return toast({
          title: "Input kode hanya bisa pada tanggal perjanjian!",
          variant: "destructive",
        });
    },
  });

  function onSubmitOTP(codeValues: TCheckBookingCodeSchema) {
    try {
      checkCodeValid(codeValues);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateCodeStatus() {
    await axios
      .get("/api/merchant")
      .then((response) => {
        return response.data.status;
      })
      .catch((error) => {});
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
                <FormLabel>Input Kode Booking</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {new Array(6).fill(0).map((_, i) => (
                        <InputOTPSlot index={i} key={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                {/* <FormDescription className="flex items-center"></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-5">
            <ButtonWithLoader
              buttonText="Submit"
              isLoading={updateLoading}
              type="submit"
              variant="secondary"
              className={
                " bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
              }
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CodeBookingInput;
