import React, { useEffect } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Merchant } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/core/components/loader/loader";
import ReviewCard from "@/core/components/reviewCard";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";

interface TGetReviewMerchant {
  booking: {
    bookingSchedule: Date;
    bookingDesc: string;
    bookingPhotoUrl: string;
  };
  user: { name: string; photo: string };
  reviewStars: string;
  reviewBody: string;
}

interface UserReviewData {
  page: number;
  total: number;
  perpage: number;
  data: TGetReviewMerchant[];
}

const MerchantDashboardRating = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const pageFromQueryParams = searchParams.get("page");

  const params = {
    page: pageFromQueryParams,
  };

  const { ref, inView } = useInView();

  const {
    data: reviewMerchantDetail,
    isLoading: reviewMerchantDetailLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getUserRatingData", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get("/api/merchant/review", {
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

  console.log(reviewMerchantDetail);

  if (reviewMerchantDetailLoading) {
    return <Loader />;
  }

  return (
    <div className="px-4">
      <h1 className="text-xl sm:text-2xl font-bold pt-5">Ulasan</h1>
      <ul className="pt-5 grid gap-4 pb-14">
        {reviewMerchantDetail?.pages.map(
          (page: UserReviewData, pageIndex: number) => (
            <React.Fragment key={pageIndex}>
              {page.data.length !== 0 ? (
                page.data.map((value: any) => (
                  <div key={value.bookingId}>
                    <ReviewCard
                      name={value.user ? value.user.name : ""}
                      image={value.user ? value.user.image : ""}
                      userReview={value !== null ? value.reviewBody : ""}
                      userRating={value !== null ? value.reviewStars : ""}
                      bookingPhotoUrl={value.booking.bookingPhotoUrl}
                      bookingComplain={value.booking.bookingComplain}
                      reviewCreatedAt={value !== null && value.reviewCreatedAt}
                      bookingId={value.bookingId}
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-[50vh]">
                  <div className="text-center">belum ada rating</div>
                </div>
              )}
            </React.Fragment>
          )
        )}

        <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
      </ul>
    </div>
  );
};

export default MerchantDashboardRating;
