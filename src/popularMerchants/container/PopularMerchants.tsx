import React, { useEffect } from "react";
import Image from "next/image";
import MerchantsCard from "../../core/components/merchantsCard";
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

const PopularMerchants = () => {
  const { data: session } = useSession();

  const { data: getMerchantsPopular, isLoading: getMerchantsPopularLoading } =
    useQuery({
      queryKey: ["getMerchantsPopular"],
      queryFn: async () =>
        await axios.get("/api/merchant").then((response) => {
          return response.data.data as any;
        }),
    });

  console.log(getMerchantsPopular);
  if (getMerchantsPopularLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-bold pb-10 sm:pb-0  flex items-center gap-2">
          Teknisi Terpopular{" "}
          <span className="text-2xl">
            <StarsIcon fill="orange" strokeWidth={1} />
          </span>
        </h2>
      </div>

      <div className="flex items-start justify-center">
        <div className="grid gap-4 px-2 md:pt-10">
          {getMerchantsPopular &&
            getMerchantsPopular.map((value: TMerchantModel) => {
              return (
                <div key={value.merchantId}>
                  <MerchantsCard
                    imgSource={value.merchantPhotoUrl}
                    imgAlt={value.merchantName}
                    location={value.merchantCity}
                    merchName={value.merchantName}
                    merchantId={value.merchantId ? value.merchantId : ""}
                    merchantRating={
                      value.merchantRating ? value.merchantRating : 0
                    }
                    serviceCategory={value.merchantCategory}
                  />
                </div>
              );
            })}
        </div>
        <div className="hidden lg:block">
          <Image
            src={"/Electrician-rafiki.svg"}
            alt="Electrician-rafiki"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default PopularMerchants;
