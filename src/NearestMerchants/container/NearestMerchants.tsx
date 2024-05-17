import React from "react";
import Image from "next/image";
import MerchantsCard from "../../core/components/merchantsCard";
import { useGeoLocation } from "@/core/hooks/useGeolocation";
import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { NoResultsBoundary } from "@/search/component/noResultBondaries";
import { NoResults } from "@/search/component/noResult";
import { Hit } from "@/search/component/hit";
import algoliasearch from "algoliasearch";
import { connectStateResults } from "react-instantsearch-dom";

const NearMerchants = () => {
  const { latLng } = useGeoLocation();

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
  );
  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <h2 className="text-xl sm:text-2xl font-bold pb-10 pt-10 flex items-center gap-2">
          Teknisi Terdekat <span className="text-2xl">📍</span>
        </h2>
      </div>
      <div className="flex items-start justify-center">
        <InstantSearch indexName="merchants" searchClient={searchClient}>
          <Configure
            aroundLatLng={latLng}
            aroundRadius={50000}
            filters="merchantAvailable:true"
            getRankingInfo
          />
          <div className=" grid gap-4 max-h-[70vh] w-full lg:w-[50%] overflow-auto sm:p-10 no-scrollbar">
            <div>
              <NoResultsBoundary fallback={<NoResults />}>
                <Hits hitComponent={Hit} classNames={{ list: "grid gap-2" }} />
              </NoResultsBoundary>
            </div>
          </div>
        </InstantSearch>
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

export default NearMerchants;
