"use client";
import { CarouselImage } from "@/core/components/carousel-image";
import Loader from "@/core/components/loader/loader";
import Modal from "@/core/components/modal";
import ReviewCard from "@/core/components/reviewCard";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { CarouselItem } from "@/core/components/ui/carousel";
import { getRoundedRating } from "@/core/lib/utils";
import { MerchantAlbum } from "@/merchants/component/merchantDashboard/merchantDashboardProfile";
import { TMerchantBenefitModel, TMerchantModel } from "@/merchants/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  CheckCircle,
  FormInputIcon,
  Hammer,
  Handshake,
  MapPinIcon,
  PlusIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// interface MerchantDetails {
//   merchantPhotoUrl: string;
//   merchantAvailable: boolean;
//   merchantCategory: string[];
//   merchantCity: string;
//   merchantCreatedAt: string;
//   merchantDesc: string;
//   merchantId: string;
//   merchantLat: number;
//   merchantLong: number;
//   merchantName: string;
//   merchantProvince: string;
//   merchantRating: number | null;
//   merchantReviewCt: number | null;
//   merchantVerified: boolean;
//   merchantAlbums?: string[];
// }

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

  const {
    isLoading: getMerchantDetailsloading,
    error: getMerchantDetailsError,
    data: merchantDetails,
  } = useQuery({
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const ceiledRating = getRoundedRating(merchantDetails?.merchantRating || 0);

  if (
    getMerchantDetailsloading ||
    userReviewDataLoading ||
    getMerchantAlbumsloading ||
    getMerchantBenefitsLoading
  ) {
    return <Loader />;
  }

  return (
    <div className="wrapper pb-20 ">
      <div className="relative flex flex-col gap-4 items-start justify-end w-full">
        <div className="w-full bg-white shadow-md sm:mt-10 rounded-lg ">
          <Image
            src={
              merchantDetails && merchantDetails.merchantBanner
                ? merchantDetails.merchantBanner
                : ""
            }
            alt={merchantDetails ? merchantDetails.merchantName : ""}
            width={300}
            height={300}
            className="object-cover w-full h-[40vh] brightness-50 object-center sm:rounded-lg"
          />
        </div>
        <div className="flex absolute p-5 gap-2 items-center">
          <div className="">
            <Image
              src={merchantDetails ? merchantDetails.merchantPhotoUrl : ""}
              className="aspect-square rounded-full object-cover object-center"
              alt="userImage"
              width={100}
              height={100}
            />
          </div>
          <div className="grid gap-1">
            <div className="flex gap-4 items-center">
              <h1 className="text-sm font-bold sm:text-2xl text-white text-wrap max-w-[200px] sm:max-w-[400px] break-words">
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
            <h2 className="text-xs sm:text-xl text-white flex items-center gap-2 ">
              <div className="flex flex-wrap max-w-full sm:max-w-full h-fit gap-1 sm:gap-3">
                {merchantDetails?.merchantCategory.map((value, index) => (
                  <span key={index}>{value}</span>
                ))}
              </div>
            </h2>
          </div>
        </div>
        {/* <StatusMerchant status={"online"} /> */}
      </div>
      <div className="px-4 sm:px-0 flex flex-col sm:flex-row gap-10 pt-10 w-full ">
        <div className="w-full">
          {merchantAlbums && merchantAlbums.length > 0 ? (
            <CarouselImage>
              {merchantAlbums.map((value: any, index) => (
                <CarouselItem key={index}>
                  <Image
                    key={index}
                    src={merchantAlbums ? value.albumPhotoUrl : ""}
                    width={300}
                    height={300}
                    alt="biaya-service-ac"
                    className="object-cover object-center w-full sm:h-[500px] h-[300px] rounded-lg border hover:cursor-pointer"
                    onClick={() => handleImageClick(value.albumPhotoUrl)}
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
        <div className="flex flex-col gap-10 border h-full w-full border-gray-200 shadow-md rounded-lg p-4 sticky top-0">
          <div>
            <h1 className=" text-lg font-bold flex items-center gap-4">
              Tentang Mitra{" "}
            </h1>
            <div className="grid place-items-start gap-2 pt-5">
              <div className="flex items-center gap-2">
                <Star size={15} />
                {ceiledRating !== 0 ? (
                  <p className=" text-sm font-semibold">
                    Rating:{" "}
                    <span className="text-sm font-normal text-gray-600">
                      {ceiledRating}, ({merchantDetails?.merchantReviewCt})
                    </span>{" "}
                  </p>
                ) : (
                  <p className=" text-sm font-semibold">
                    Rating:{" "}
                    <span className="text-sm font-normal text-gray-600">
                      Belum ada rating
                    </span>{" "}
                  </p>
                )}
              </div>
              {getMerchantBenefits?.map((value, index) => (
                <div key={index}>
                  {value.benefitType === "experience" && (
                    <div className="flex items-center gap-2">
                      <Hammer size={15} />
                      <p className=" text-sm font-semibold">
                        Pengalaman:{" "}
                        <span className="text-sm font-normal text-gray-600">
                          {value.benefitBody}
                        </span>
                      </p>
                    </div>
                  )}
                  {value.benefitType === "warranty" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} />
                      <p className=" text-sm font-semibold">
                        Garansi:{" "}
                        <span className="text-sm font-normal text-gray-600">
                          {value.benefitBody}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2">
                <MapPinIcon size={15} />
                <p className=" text-sm font-semibold max-w-[250px] sm:max-w-full break-words">
                  Lokasi:{" "}
                  <span className="text-sm font-normal text-gray-600 ">
                    {merchantDetails?.merchantCity},{" "}
                    {merchantDetails?.merchantProvince}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center ">
            <Link href={`${pathname}/buat-janji`}>
              <Button
                variant={"default"}
                className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 text-sm"
              >
                Buat janji
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-0">
        <div className="relative border shadow-md p-4 w-full mt-20 rounded-lg">
          <h1 className="text-lg font-semibold">Deskripsi</h1>
          <p className="mt-10 flex items-center gap-4 max-w-[350px] sm:max-w-full break-words">
            {merchantDetails?.merchantDesc}
          </p>
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
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        imageUrl={currentImageUrl}
      />
    </div>
  );
};

export default MerchantDetailPage;
