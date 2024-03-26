"use client";

import { Button } from "@/core/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function Page() {
  const { data: session } = useSession();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const formSchema = z.object({
    username: z.string().min(2),
    email: z.string().min(2),
    region: z.string(),
    noTelepon: z.string().min(10, {
      message: "Nomor telepon kurang dari 10 digit",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user?.name || "",
      email: session?.user?.email || "",
      region: "+62",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values) setIsSubmitted(true);
  }

  return (
    <div className="wrapper py-20 w-fit ">
      <Card>
        {" "}
        <CardHeader>
          <h1 className="font-bold text-lg">New User Form</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {isSubmitted ? (
                <>
                  <div>test</div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="pt-5 flex-col justify-between md:flex ">
                          <div>
                            <h1 className="pb-2 font-semibold">Nama</h1>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex-col justify-between md:flex pt-10">
                          <div>
                            <h1 className="pb-2 font-semibold">Email</h1>
                            <FormControl>
                              <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <h1 className="font-semibold pt-10 pb-2">Nomor Telepon</h1>
                  <div className="flex justify-start items-center  gap-5 w-fit">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <div className=" flex-col justify-between md:flex ">
                            <div>
                              <div className="flex gap-4 max-w-fit">
                                <FormControl>
                                  <Input disabled {...field} />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noTelepon"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex-col justify-between md:flex ">
                            <div>
                              <div className="flex gap-4">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <div className="text-right pt-5">
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
        </CardContent>
      </Card>
    </div>
  );
}
