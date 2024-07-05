"use client";

import Loader from "@/core/components/loader/loader";
import Modal from "@/core/components/modal";
import ReviewCard from "@/core/components/reviewCard";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/core/components/ui/carousel";
import { MerchantAlbum } from "@/merchants/component/merchantDashboard/merchantDashboardProfile";
import { TMerchantBenefitModel, TMerchantModel } from "@/merchants/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CalendarPlusIcon,
  CheckCircle,
  Hammer,
  MapPinIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import DOMPurify from "dompurify";
import CarouselImage from "@/core/components/CarouselImage";
import dayjs from "dayjs";
import StarRating from "@/core/components/starRating";
import CategoryBadge from "@/core/components/categoryBadge";

interface UserReviewData {
  page: number;
  total: number;
  perpage: number;
  data: any[];
}

const MerchantDetailPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
    setShowModal(true);
  };
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const merchantId = splitPathname.pop() || "";
  const searchParams = useSearchParams();
  const pageFromQueryParams = searchParams.get("page");
  const { ref, inView } = useInView();

  const params = {
    page: pageFromQueryParams,
  };

  const { isLoading: getMerchantDetailsloading, data: merchantDetails } =
    useQuery({
      queryKey: ["getMerchantDetails", merchantId],
      queryFn: async () =>
        await axios.get(`/api/merchant/${merchantId}`).then((response) => {
          return response.data.data as TMerchantModel;
        }),
      enabled: !!merchantId,
    });
  const { data: getMerchantBenefits, isLoading: getMerchantBenefitsLoading } =
    useQuery({
      queryKey: ["getMerchantBenefits", merchantId],
      queryFn: async () =>
        await axios.get(`/api/merchant/${merchantId}`).then((response) => {
          return response.data.data.benefits as TMerchantBenefitModel[];
        }),
    });

  const { isLoading: getMerchantAlbumsloading, data: merchantAlbums } =
    useQuery({
      queryKey: ["getMerchantAlbum", merchantId],
      queryFn: async () =>
        await axios.get(`/api/merchant/${merchantId}`).then((response) => {
          return response.data.data.merchantAlbums as MerchantAlbum[];
        }),
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
      const response = await axios.get<UserReviewData>(
        `/api/merchant/${merchantId}/review`,
        {
          params: {
            ...params,
            page: pageParam,
          },
        }
      );
      return response.data;
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

  if (
    getMerchantDetailsloading ||
    userReviewDataLoading ||
    getMerchantAlbumsloading ||
    getMerchantBenefitsLoading
  ) {
    return <Loader />;
  }

  return (
    <div className="wrapper pb-20">
      <div className="relative flex flex-col gap-4 items-start justify-end w-full">
        {merchantDetails?.merchantBanner ? (
          <div className="w-full shadow-md sm:mt-6 rounded-lg ">
            <Image
              src={merchantDetails.merchantBanner}
              alt={merchantDetails ? merchantDetails.merchantName : ""}
              width={300}
              height={300}
              className="object-cover w-full h-[240px] sm:h-[360px] brightness-50 object-center sm:rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full shadow-md sm:mt-6 rounded-lg">
            <Image
              src={"/AdamSucipto.svg"}
              alt={
                merchantDetails ? merchantDetails.merchantName : "Electrobuzz"
              }
              width={300}
              height={300}
              className="object-cover w-full h-[360px] brightness-50 object-center sm:rounded-lg"
            />
          </div>
        )}
        <div className="flex absolute p-5 gap-2 items-center">
          <div>
            <Image
              src={merchantDetails?.merchantPhotoUrl || ""}
              className="aspect-square rounded-full object-cover object-center w-20 h-20"
              alt="userImage"
              width={100}
              height={100}
            />
          </div>
          <div className="grid gap-1">
            <div className="flex gap-4 items-center">
              <h1 className="font-bold text-2xl text-white text-wrap break-words">
                {merchantDetails?.merchantName}
              </h1>
              <div className="flex items-center gap-1 px-2 py-1 bg-black/40 text-white rounded-full">
                <Star
                  size={15}
                  fill="orange"
                  strokeWidth={0}
                  className="text-yellow-400"
                />
                <span className="text-[0.8rem]">
                  {merchantDetails?.merchantRating &&
                  merchantDetails?.merchantRating > 0
                    ? merchantDetails?.merchantRating.toFixed(1)
                    : "-"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center text-white font-lg">
              <MapPinIcon size={15} />
              <span>{merchantDetails?.merchantCity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-6 px-4 sm:px-0 mt-6 w-full">
        <div className="grow">
          {merchantAlbums && merchantAlbums.length > 0 ? (
            <CarouselImage>
              {merchantAlbums.map(({ merchantAlbumId, albumPhotoUrl }) => (
                <CarouselItem key={merchantAlbumId} className="rounded-lg">
                  <Image
                    src={merchantAlbums ? albumPhotoUrl : ""}
                    width={400}
                    height={300}
                    alt="biaya-service-ac"
                    className=" w-full sm:h-[500px] h-[300px] object-cover object-center rounded-lg hover:cursor-pointer"
                    onClick={() => handleImageClick(albumPhotoUrl)}
                  />
                </CarouselItem>
              ))}
            </CarouselImage>
          ) : (
            <div className="flex justify-center items-center w-full h-[200px] sm:h-[300px] bg-gray-100 dark:bg-slate-900 rounded-xl">
              <p>No Picture Available</p>
            </div>
          )}

          <div className="mt-6 p-4 max-w-full border rounded-lg shadow-md">
            <h1 className="text-lg font-semibold">Deskripsi</h1>
            <div className="my-3 border-b border-slate-300 dark:border-accent"></div>
            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(merchantDetails?.merchantDesc || ""),
              }}
            />
          </div>

          <div className="mt-6 p-4 max-w-full border rounded-lg shadow-md">
            <h1 className="text-lg font-semibold">Ulasan Pengguna</h1>
            <div className="my-3 border-b border-slate-300 dark:border-accent"></div>
            <ul className="grid">
              {userReviewData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.length !== 0 ? (
                    page.data.map((value: any) => (
                      <li
                        key={value.bookingId}
                        className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 first:border-t-0 border-t border-accent"
                      >
                        <div className="flex sm:grid sm:justify-center justify-items-center items-center gap-2 sm:gap-0 sm:w-[140px]">
                          <Image
                            src={value.user ? value.user.image : ""}
                            width={80}
                            height={80}
                            alt={value.user.name}
                            className="h-9 sm:h-16 w-9 sm:w-16 object-cover rounded-full"
                          />
                          <div className="grid items-center sm:text-center">
                            <span className="sm:mt-2 sm:w-[140px] text-center font-medium truncate">
                              {value.user.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {dayjs(value.reviewCreatedAt).format(
                                "DD MMM YYYY"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="grow sm:p-4">
                          <div className="flex gap-1 items-center sm:mb-2">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <Star
                                  key={index}
                                  size={15}
                                  strokeWidth={1}
                                  fill={
                                    index + 1 <= value.reviewStars
                                      ? "orange"
                                      : "gray"
                                  }
                                  stroke={
                                    index + 1 <= value.reviewStars
                                      ? "orange"
                                      : "gray"
                                  }
                                />
                              ))}
                          </div>
                          <span className="text-sm">{value.reviewBody}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-[10vh]">
                      <div className="text-center text-gray-400 italic">
                        Mitra ini belum memiliki ulasan
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
            </ul>
          </div>
        </div>

        <div className="sm:sticky top-6 flex flex-col gap-6 border h-full min-w-[360px] shadow-md rounded-lg p-4">
          <div>
            <h1 className="text-lg font-bold">Tentang Mitra</h1>
            <div className="my-3 border-b border-slate-300 dark:border-accent"></div>
            <div className="grid place-items-start gap-2">
              <div className="flex items-center gap-2">
                <Star size={15} className="shrink-0" />
                {(merchantDetails?.merchantRating || 0) > 0 ? (
                  <p className=" text-sm font-semibold">
                    Rating:{" "}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      {merchantDetails?.merchantRating?.toFixed(1)} (
                      {merchantDetails?.merchantReviewCt} ulasan)
                    </span>{" "}
                  </p>
                ) : (
                  <p className=" text-sm font-semibold">
                    Rating:{" "}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      -
                    </span>{" "}
                  </p>
                )}
              </div>
              {getMerchantBenefits?.map((value, index) => (
                <div key={index}>
                  {value.benefitType === "experience" && (
                    <div className="flex items-center gap-2">
                      <Hammer size={15} className="shrink-0" />
                      <p className=" text-sm font-semibold">
                        Pengalaman:{" "}
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          {value.benefitBody}
                        </span>
                      </p>
                    </div>
                  )}
                  {value.benefitType === "warranty" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} className="shrink-0" />
                      <p className=" text-sm font-semibold">
                        Garansi:{" "}
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          {value.benefitBody}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2">
                <MapPinIcon size={15} className="shrink-0" />
                <p className=" text-sm font-semibold max-w-[250px] sm:max-w-full break-words">
                  Lokasi:{" "}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ">
                    {merchantDetails?.merchantCity},{" "}
                    {merchantDetails?.merchantProvince}
                  </span>
                </p>
              </div>
            </div>
            {(merchantDetails?.merchantCategory.length || 0) > 0 && (
              <ul className="flex gap-1 flex-wrap mt-2">
                {merchantDetails?.merchantCategory.map((category) => (
                  <CategoryBadge key={category} categoryName={category} />
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black rounded-sm transition duration-500"
              asChild
            >
              <a
                href={`${pathname}/buat-janji`}
                className="flex gap-2 items-center"
              >
                <CalendarPlusIcon size={15} />
                Buat janji
              </a>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        imageUrl={currentImageUrl}
      />
    </div>
  );
};

export default MerchantDetailPage;
