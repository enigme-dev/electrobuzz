"use client";

import {
  TGetMerchantBookingDone,
  TGetUserBooking,
  TGetUserBookingDone,
} from "@/bookings/types";
import Loader from "@/core/components/loader/loader";
import ReviewCard from "@/core/components/reviewCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface UserReviewData {
  page: number;
  total: number;
  perpage: number;
  data: TGetUserBookingDone[];
}

const UserRatingPage = () => {
  const searchParams = useSearchParams();

  const pageFromQueryParams = searchParams.get("page");

  const params = {
    page: pageFromQueryParams,
  };

  const { ref, inView } = useInView();

  const {
    data: userReviewData,
    isLoading: userReviewDataLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getUserRatingData", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get("/api/user/review", {
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  console.log(userReviewData);

  if (userReviewDataLoading) {
    return <Loader />;
  }
  return (
    <div className="wrapper py-10 px-4">
      <h1 className="font-bold text-lg sm:text-xl mb-5">Ulasan Pengguna</h1>
      <div>
        <div className=" grid gap-5 pb-20 sm:pb-5">
          {userReviewData?.pages.map(
            (page: UserReviewData, pageIndex: number) => (
              <React.Fragment key={pageIndex}>
                {page.data.length !== 0 && page.data !== undefined ? (
                  page.data.map((value: TGetUserBookingDone) => (
                    <div key={value.bookingId}>
                      <ReviewCard
                        name={value.merchant ? value.merchant.merchantName : ""}
                        image={
                          value.merchant ? value.merchant.merchantPhotoUrl : ""
                        }
                        userReview={
                          value.review !== null ? value.review?.reviewBody : ""
                        }
                        userRating={
                          value.review !== null ? value.review?.reviewStars : 0
                        }
                        bookingPhotoUrl={value ? value.bookingPhotoUrl : ""}
                        bookingComplain={value ? value.bookingComplain : ""}
                        reviewCreatedAt={
                          value.review
                            ? value.review.reviewCreatedAt
                            : undefined
                        }
                        bookingId={value.bookingId}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">Hasil tidak ditemukan</div>
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

export default UserRatingPage;
