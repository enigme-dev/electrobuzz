"use client";

import { Hit } from "@/search/component/hit";
import { MenuSelect } from "@/search/component/menuSelect";
import algoliasearch from "algoliasearch/lite";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Configure,
  useInstantSearch,
} from "react-instantsearch";
import { NoResultsBoundary } from "@/search/component/noResultBondaries";
import { NoResults } from "@/search/component/noResult";
import { GeneralAccordion } from "@/core/components/general-accordion";
import { useGeoLocation } from "@/core/hooks/useGeolocation";
import Loader from "@/core/components/loader/loader";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

function LoadingIndicator() {
  const { status } = useInstantSearch();

  if (status === "stalled") {
    return <Loader />;
  }
  return null;
}
export default function Page() {
  const { latLng } = useGeoLocation();

  return (
    <div className="flex flex-col wrapper px-4">
      <div className="flex items-center justify-center md:pt-10">
        <Image
          src="/House searching-cuate.svg"
          alt="searchingCuate"
          width={200}
          height={200}
          className="text-center md:hidden"
        />
      </div>
      <InstantSearch
        searchClient={searchClient}
        indexName="merchants"
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure
          aroundLatLng={latLng}
          aroundRadius={50000}
          filters="merchantAvailable:true"
          getRankingInfo
        />
        <div className="rounded-lg w-full flex justify-center items-center">
          <div className="flex gap-2 items-center rounded-lg px-6 shadow-md border w-full justify-center">
            <SearchBox
              placeholder="Search for any services"
              classNames={{
                root: "rounded-lg w-full h-fit ",
                form: "flex ",
                input:
                  "grow py-3 outline-none text-md dark:bg-[#020817] w-full",
                submitIcon: "hidden",
                resetIcon: "hidden",
                loadingIcon: "hidden",
              }}
            />
            <Search className="w-10" />
          </div>
        </div>
        <div className="flex gap-10  mt-10 flex-col lg:flex-row h-full">
          <div className="pb-0 sm:pb-6 w-full lg:w-[40%]  h-full lg:sticky lg:top-4 ">
            <div className="flex gap-2 items-center max-w-full  justify-end">
              <MapPin />
              <MenuSelect attribute="merchantCity" />
            </div>
            <GeneralAccordion accordionTrigger="Filter">
              <GeneralAccordion accordionTrigger="Kategori">
                {" "}
                <RefinementList
                  attribute="_tags"
                  limit={7}
                  classNames={{
                    root: "",
                    count: "hidden",
                    checkbox: "hidden",
                    label:
                      "cursor-pointer w-full border text-center py-1 sm:dark:hover:text-black sm:hover:border-yellow-300 sm:hover:bg-yellow-300 sm:hover:shadow-lg rounded rounded-sm transition-all duration-500",
                    item: "mb-3 flex items-center justify-center w-full cursor-pointer rounded rounded-sm",
                    selectedItem:
                      "text-black bg-yellow-300 dark:bg-yellow-300 shadow-lg",
                    list: " grid grid-cols-2 m-0 place-items-center items-center gap-5 justify-around p-2  rounded-lg",
                  }}
                />
              </GeneralAccordion>
            </GeneralAccordion>
          </div>
          <div className="w-full">
            <NoResultsBoundary fallback={<NoResults />}>
              <LoadingIndicator />
              <Hits hitComponent={Hit} classNames={{ list: "grid gap-5" }} />
            </NoResultsBoundary>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
