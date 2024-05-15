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
} from "react-instantsearch";
import { NoResultsBoundary } from "@/search/component/noResultBondaries";
import { NoResults } from "@/search/component/noResult";
import { GeneralAccordion } from "@/core/components/general-accordion";
import { useEffect, useState } from "react";
import { useToast } from "@/core/components/ui/use-toast";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

export default function Page() {
  const [latLng, setLatLng] = useState("");
  const { toast } = useToast();

  const onGeoSuccess = (position: GeolocationPosition) => {
    setLatLng(`${position.coords.latitude},${position.coords.longitude}`);
  };

  const onGeoError = () =>
    toast({
      description: "Unable to retrieve location",
      variant: "destructive",
    });

  useEffect(() => {
    if (!navigator.geolocation) {
      toast({
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    } else {
      navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
    }
  }, []);

  return (
    <div className="flex flex-col wrapper">
      <span>{latLng}</span>
      <div className="rounded-lg px-10 h-fit sm:h-[80vh]">
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
            // aroundLatLng={latLng}
            aroundRadius={50000}
            aroundLatLngViaIP
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
          <div className="flex flex-col md:flex-row h-full">
            <div className="py-6 w-full md:w-[40%]">
              <div className="flex gap-2 items-center w-full  justify-end">
                <MapPin />
                <MenuSelect attribute="merchantCity" />
              </div>
              <GeneralAccordion accordionTrigger="Filter">
                <GeneralAccordion accordionTrigger="Kategori">
                  {" "}
                  <RefinementList
                    attribute="_tags"
                    classNames={{
                      root: "py-3",
                      count: " p-1 rounded-md ml-3 text-gray-800 text-sm",
                      labelText: "ml-3 ",
                      item: "mb-3",
                      list: "grid grid-cols-2 m-0 place-items-center items-center gap-5 justify-around p-4 bg-gray-200 dark:bg-[#030c24] rounded-lg",
                    }}
                  />
                </GeneralAccordion>
                <GeneralAccordion accordionTrigger="Rating">
                  <div>Rating</div>
                </GeneralAccordion>
              </GeneralAccordion>
            </div>

            <div className="flex flex-col gap-6 w-full h-[80vh]   max-h-full overflow-auto rounded-lg sm:p-10 no-scrollbar">
              <NoResultsBoundary fallback={<NoResults />}>
                <Hits hitComponent={Hit} classNames={{ list: "grid gap-2" }} />
              </NoResultsBoundary>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}
