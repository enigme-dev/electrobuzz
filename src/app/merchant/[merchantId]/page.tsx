"use client";
import { CarouselImage } from "@/core/components/carousel-image";
import Loader from "@/core/components/loader/loader";
import ReviewCard from "@/core/components/reviewCard";
import { Card } from "@/core/components/ui/card";
import { CarouselItem } from "@/core/components/ui/carousel";
import { getRoundedRating } from "@/core/lib/utils";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPinIcon, PlusIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface MerchantDetails {
  merchantPhotoUrl: string;
  merchantAvailable: boolean;
  merchantCategory: string[];
  merchantCity: string;
  merchantCreatedAt: string;
  merchantDesc: string;
  merchantId: string;
  merchantLat: number;
  merchantLong: number;
  merchantName: string;
  merchantProvince: string;
  merchantRating: number | null;
  merchantReviewCt: number | null;
  merchantVerified: boolean;
  merchantAlbums?: string[];
}

interface UserReviewData {
  page: number;
  total: number;
  perpage: number;
  data: any[];
}

const MerchantDetailPage = () => {
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const merchantId = splitPathname.pop() || "";
  const searchParams = useSearchParams();
  const pageFromQueryParams = searchParams.get("page");
  const { ref, inView } = useInView();

  const params = {
    page: pageFromQueryParams,
  };

  const {
    isLoading: getMerchantDetailsloading,
    error: getMerchantDetailsError,
    data: merchantDetails,
  } = useQuery({
    queryKey: ["getMerchantDetails", merchantId],
    queryFn: async () =>
      await axios.get(`/api/merchant/${merchantId}`).then((response) => {
        return response.data.data as MerchantDetails;
      }),
    enabled: !!merchantId,
  });

  const {
    data: userReviewData,
    isLoading: userReviewDataLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getAllUserRatingInMerchantDetail", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`/api/merchant/${merchantId}/review`, {
        params: {
          ...params,
          page: pageParam,
        },
      });
      return response.data as UserReviewData[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, total, perpage } = lastPage;
      if (!lastPage) return undefined;
      if (page) {
        if (page * perpage < total) {
          return page + 1;
        }
      }

      return undefined;
    },
  });

  console.log(userReviewData);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const ceiledRating = getRoundedRating(merchantDetails?.merchantRating || 0);

  if (getMerchantDetailsloading || userReviewDataLoading) {
    return <Loader />;
  }

  return (
    <div className="wrapper pb-20 ">
      <div className="">
        <div className="relative flex flex-col gap-4 items-start justify-end w-full">
          <Image
            src={merchantDetails ? merchantDetails.merchantPhotoUrl : ""}
            alt={merchantDetails ? merchantDetails.merchantName : ""}
            width={300}
            height={300}
            className="object-cover w-full h-[40vh] brightness-50 object-center"
          />
          <div className="absolute p-5 grid gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold sm:text-3xl text-white text-wrap max-w-[200px] sm:max-w-[400px] break-words">
                {merchantDetails?.merchantName}
              </h1>
              <Card className="flex items-center gap-2 px-2 py-1">
                {merchantDetails?.merchantRating ? (
                  <>
                    <Star
                      size={15}
                      fill="orange"
                      strokeWidth={0}
                      className="text-yellow-400"
                    />
                    <p className="text-xs">{ceiledRating}</p>
                  </>
                ) : (
                  <p className="text-gray-400 italic text-xs sm:text-sm">
                    belum ada rating
                  </p>
                )}
              </Card>
            </div>
            <h2 className="text-sm sm:text-2xl text-white flex items-center gap-2 ">
              <div className="flex flex-wrap max-w-full sm:max-w-full h-fit gap-1 sm:gap-3">
                {merchantDetails?.merchantCategory.map((value, index) => (
                  <span key={index}>{value}</span>
                ))}
              </div>
            </h2>
            <h2 className="text-xs sm:text-2xl text-white flex items-center gap-2 ">
              <span className="bg-red-500 rounded-lg py-1 px-2">
                <MapPinIcon className="text-white w-4" />
              </span>
              {merchantDetails?.merchantCity}
            </h2>
          </div>
          {/* <StatusMerchant status={"online"} /> */}
        </div>
      </div>
      <div className="px-4 grid sm:grid-cols-2 sm:flex-row gap-8 pt-10 w-full ">
        <div className="w-full ">
          {merchantDetails?.merchantAlbums &&
          merchantDetails.merchantAlbums.length > 0 ? (
            <CarouselImage>
              {merchantDetails.merchantAlbums.map((value: any, index) => (
                <CarouselItem key={index}>
                  <Image
                    key={index}
                    src={
                      merchantDetails?.merchantAlbums ? value.albumPhotoUrl : ""
                    }
                    width={300}
                    height={300}
                    alt="biaya-service-ac"
                    className="object-contain w-full h-[320px]"
                  />
                </CarouselItem>
              ))}
            </CarouselImage>
          ) : (
            <div className="flex justify-center items-center w-full h-[200px] sm:h-[300px] bg-gray-100 dark:bg-slate-900 rounded-xl">
              <p>No Picture Available</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div>
            <h1 className="text-bold text-2xl flex items-center gap-4">
              Deskripsi{" "}
            </h1>
            <p className="mt-10 flex items-center gap-4 max-w-[350px] sm:max-w-[500px] break-words">
              {merchantDetails?.merchantDesc}
            </p>
          </div>
          <div className="flex justify-center">
            <Link href={`${pathname}/buat-janji`}>
              <Card className="flex gap-5 items-center sm:w-52 bg-yellow-400 text-black dark:text-black hover:bg-yellow-300 px-5 py-2 mt-10 sm:mb-10">
                <PlusIcon width={15} />
                <p className="text-sm sm:text-lg">Buat Janji</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-4">
        <h1 className="text-bold text-2xl pt-10">Ulasan</h1>
        <div className="pt-8 grid gap-4">
          {userReviewData?.pages.map(
            (page: UserReviewData, pageIndex: number) => (
              <React.Fragment key={pageIndex}>
                {page.data.length !== 0 ? (
                  page.data.map((value: any) => (
                    <div key={value.bookingId}>
                      <ReviewCard
                        name={value.user ? value.user.name : ""}
                        image={value.user ? value.user.image : ""}
                        userReview={value ? value.reviewBody : ""}
                        userRating={value ? value.reviewStars : ""}
                        bookingPhotoUrl={value.booking.bookingPhotoUrl}
                        bookingComplain={value.booking.bookingComplain}
                        reviewCreatedAt={
                          value !== null && value.reviewCreatedAt
                        }
                        bookingId={value.bookingId}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[10vh]">
                    <div className="text-center text-gray-400 italic">
                      Mitra ini belum memiliki ulasan
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          )}

          <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetailPage;
