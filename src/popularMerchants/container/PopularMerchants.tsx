import React, { useEffect } from "react";
import Image from "next/image";
import { useGeoLocation } from "@/core/hooks/useGeolocation";
import {
  Configure,
  Hits,
  InstantSearch,
  useInstantSearch,
} from "react-instantsearch";
import { NoResultsBoundary } from "@/search/component/noResultBondaries";
import { NoResults } from "@/search/component/noResult";
import { Hit } from "@/search/component/hit";
import algoliasearch from "algoliasearch";

import { MapPinIcon, StarIcon, StarsIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TMerchantModel } from "@/merchants/types";
import Loader from "@/core/components/loader/loader";
import PopularMerchantsCard from "../../core/components/merchantCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import MerchantCard from "../../core/components/merchantCard";

const PopularMerchants = () => {
  const { data: getMerchantsPopular, isLoading: getMerchantsPopularLoading } =
    useQuery({
      queryKey: ["getMerchantsPopular"],
      queryFn: async () =>
        await axios.get("/api/merchant").then((response) => {
          return response.data.data as any;
        }),
    });

  if (getMerchantsPopularLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between relative">
        <h2 className="text-xl sm:text-2xl font-bold  flex items-center gap-2 ">
          <span className="text-2xl">🌟</span> Teknisi Terpopuler
        </h2>
      </div>
      <Carousel className="w-full mt-10">
        <CarouselContent className="-ml-1">
          {getMerchantsPopular &&
            getMerchantsPopular.map((value: TMerchantModel) => (
              <CarouselItem
                key={value.merchantId}
                className="basis-[75%] py-2 lg:basis-1/3 md:basis-1/2"
              >
                <MerchantCard
                  imgSource={value.merchantPhotoUrl}
                  imgAlt={value.merchantName}
                  location={value.merchantCity}
                  merchName={value.merchantName}
                  merchantId={value.merchantId ? value.merchantId : ""}
                  merchantRating={
                    value.merchantRating ? value.merchantRating : 0
                  }
                  serviceCategory={value.merchantCategory}
                  banner={value.merchantBanner}
                  merchantReviewCt={value.merchantReviewCt}
                />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </div>
  );
};

export default PopularMerchants;
