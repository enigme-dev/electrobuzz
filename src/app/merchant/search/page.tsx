"use client";

import MerchantCard from "@/core/components/merchantsCard";
import { Hit } from "@/merchant-list/component/hit";
import { MenuSelect } from "@/merchant-list/component/menuSelect";
import algoliasearch from "algoliasearch/lite";
import { MapPin, Search, SearchCheckIcon } from "lucide-react";
import Image from "next/image";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Menu,
  RefinementList,
  useInstantSearch,
} from "react-instantsearch";
import { NoResultsBoundary } from "@/merchant-list/component/noResultBondaries";
import { NoResults } from "@/merchant-list/component/noResult";
import { GeneralAccordion } from "@/core/components/general-accordion";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

export default function Page() {
  return (
    <div className="flex flex-col wrapper">
      <div className="rounded-lg px-10 h-screen sm:h-[80vh]">
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
        >
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

            <div className="flex flex-col gap-6 w-full  max-h-full overflow-auto rounded-lg sm:p-10 no-scrollbar">
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
