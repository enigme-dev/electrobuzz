import {
  CreateReviewSchema,
  TBookingReasonSchema,
  TCreateReviewSchema,
  TGetMerchantBookingInProgress,
  TGetUserBooking,
  TGetUserBookingDone,
  TGetUserBookingRejected,
} from "@/bookings/types";
import ButtonWithLoader from "@/core/components/buttonWithLoader";
import Loader from "@/core/components/loader/loader";
import ReviewCard from "@/core/components/reviewCard";
import StarRating from "@/core/components/starRating";
import StarRatingInput from "@/core/components/starRatingInput";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Separator } from "@/core/components/ui/separator";
import { toast } from "@/core/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BookingStatus from "../bookingStatus";
import Modal from "@/core/components/modal";

interface UserBookingDoneProps {
  bookingDetailData: TGetUserBookingDone;
}

const UserBookingDone = ({ bookingDetailData }: UserBookingDoneProps) => {
  const form = useForm<TCreateReviewSchema>({
    resolver: zodResolver(CreateReviewSchema),
  });

  const queryClient = useQueryClient();
  const [imageFullscreen, setImageFullscreen] = useState(false);

  const { mutate: createReview, isPending: createReviewLoading } = useMutation({
    mutationFn: async (values: TCreateReviewSchema) => {
      await axios
        .post(`/api/user/booking/${bookingDetailData.bookingId}/review`, values)
        .then((response) => {
          return response.data.data;
        });
    },
    onSuccess: () => {
      toast({ title: "Rating berhasil terkirim!" });
      queryClient.invalidateQueries({
        queryKey: ["getUserRatingData"],
      });
    },
    onError: () => {
      toast({ title: "Rating gagal terkirim!", variant: "destructive" });
    },
  });

  function onSubmit(value: TCreateReviewSchema) {
    createReview(value);
  }

  return (
    <div className="flex items-center justify-center mt-10  gap-10 lg:gap-20 flex-col lg:flex-row">
      {" "}
      <div className="shadow-lg border p-5 rounded-lg space-y-5">
        <div className="flex justify-between">
          <h1 className="font-semibold text-md sm:text-xl ">Keluhan User</h1>
          <BookingStatus status="done" />
        </div>
        <div>
          <h2 className="pt-2 text-sm sm:text-xl">Foto Keluhan:</h2>
          <div
            onClick={() => setImageFullscreen(true)}
            className="flex justify-center max-w-[200px] max-h-[200px] relative group pt-5 hover:opacity-50 cursor-pointer"
          >
            <Image
              src={bookingDetailData.bookingPhotoUrl}
              alt={bookingDetailData.bookingPhotoUrl}
              className=""
              width={500}
              height={500}
            />
          </div>
        </div>
        <div>
          <h2 className="pt-2 text-left text-sm sm:text-xl">Keluhan:</h2>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {bookingDetailData.bookingComplain}
          </p>
        </div>

        <div>
          <h2 className="pt-2 text-left text-sm sm:text-xl">Tanggal Janji:</h2>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {format(bookingDetailData.bookingSchedule.toString(), "PPP")}
          </p>
        </div>
        <div>
          <h1 className="text-left text-sm sm:text-xl">Alamat:</h1>
          <p className=" text-left text-sm sm:text-lg font-semibold">
            {bookingDetailData.addressDetail}, {bookingDetailData.addressCity},{" "}
            {bookingDetailData.addressProvince},{" "}
            {bookingDetailData.addressZipCode}
          </p>
        </div>
        {bookingDetailData.review ? (
          <Card className="p-5 ">
            <div className="flex items-center">
              <h2>Rating:</h2>
              <StarRating userRating={bookingDetailData.review.reviewStars} />
            </div>
            <p>Review: {bookingDetailData.review.reviewBody}</p>
          </Card>
        ) : (
          <Card className="p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-4 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="reviewStars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <StarRatingInput
                            rating={field.value}
                            onRatingChange={(rate: any) => field.onChange(rate)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="reviewBody"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Deskripsikan hasil servicemu"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <div className="flex justify-end pt-4">
                  <ButtonWithLoader
                    className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
                    buttonText="Submit"
                    isLoading={createReviewLoading}
                    type="submit"
                  />
                </div>
              </form>
            </Form>
          </Card>
        )}
        <Link className="flex justify-center" href={"/user/my-bookings"}>
          <Button variant={"outline"}>Kembali</Button>
        </Link>
      </div>
      <div>
        <Modal
          imageUrl={bookingDetailData.bookingPhotoUrl}
          setShowModal={setImageFullscreen}
          showModal={imageFullscreen}
        />
      </div>
    </div>
  );
};

export default UserBookingDone;
