"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/core/components/ui/form";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import TermsAndConditions from "./termsAndCondition";
import { useForm } from "react-hook-form";

const FormSchema = z.object({
  agreement: z
    .boolean()
    .default(false)
    .refine((value) => value === true),
});

interface RegisterAsMerchantTermsAndConditionsProps {
  onPrevious: Function;
  onNext: Function;
}

export function RegisterAsMerchantTermsAndConditions({
  onPrevious,
  onNext,
}: RegisterAsMerchantTermsAndConditionsProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      agreement: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.agreement) {
      onNext();
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <TermsAndConditions />
          </div>
          <FormField
            control={form.control}
            name="agreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow w-fit">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Saya setuju dengan Syarat dan Ketentuan diatas
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-5">
            <Button
              variant={"default"}
              className="bg-yellow-400 hover:bg-yellow-300 text-black dark:text-white"
              onClick={() => onPrevious()}
            >
              Kembali
            </Button>
            <Button
              variant={"default"}
              className="bg-yellow-400 hover:bg-yellow-300 text-black dark:text-white"
              type="submit"
            >
              Lanjut
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
