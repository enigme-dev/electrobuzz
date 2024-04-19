"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { useToast } from "@/core/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/core/components/ui/calendar";
import { cn } from "@/core/lib/shadcn";
import { format } from "date-fns";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/core/components/ui/input-otp";

const FormSchema = z.object({
  keluhan: z.string({
    required_error: "tolong deskripsikan keluhanmu",
  }),
  foto: z.any({
    required_error: "tolong isi foto keluhanmu",
  }),
  lokasi: z.string({
    required_error: "tolong isi lokasimu",
  }),
  tanggal: z.date({
    required_error: "tolong isi tanggal perjanjianmu",
  }),
  waktu: z.string({
    required_error: "tolong isi waktu perjanjianmu",
  }),
});

const BuatJanjiPage = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="wrapper py-10">
      <h1 className="font-bold text-xl pb-10">Form Buat Janji</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="keluhan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keluhan</FormLabel>
                <FormControl>
                  <Input placeholder="Deskripsikan keluhanmu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="foto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input id="picture" type="file" {...field} />
                </FormControl>
                <FormDescription>Foto keluhanmu </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lokasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input placeholder="lokasi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal janji</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>input tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waktu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    id="time"
                    className="rounded-md border border-input w-fit text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min="09:00"
                    max="18:00"
                    required
                    {...field}
                  />
                </FormControl>
                <FormDescription>isi waktu perjanjianmu</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default BuatJanjiPage;
