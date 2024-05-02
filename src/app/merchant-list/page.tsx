"use client";

import MerchantCard from "@/popular-merchants/components/popularMerchantsCard";
import { Hit } from "@/merchant-list/component/hit";
import { MenuSelect } from "@/merchant-list/component/menuSelect";
import algoliasearch from "algoliasearch/lite";
import { Search, SearchCheckIcon } from "lucide-react";
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

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

export default function Page() {
  return (
    <div className="flex flex-col wrapper">
      <div className="rounded-lg p-10 h-[100vh]">
        <InstantSearch
          searchClient={searchClient}
          indexName="merchants"
          routing
        >
          <div className=" rounded-lg w-full flex justify-center items-center">
            <div className="flex gap-2 items-center rounded-lg px-6 shadow-md border w-full justify-center">
              <SearchBox
                placeholder="Search for any services"
                classNames={{
                  root: "rounded-lg w-full h-fit",
                  form: "flex",
                  input: "grow py-3 outline-none",
                  submitIcon: "hidden",
                  resetIcon: "hidden",
                  loadingIcon: "hidden",
                }}
              />
              <Search />
            </div>
          </div>
          <div className="flex gap-10 pt-10 h-full">
            <div className="py-6 h-full w-[30%]">
              <h2 className="pb-3 text-xl">Kota</h2>
              <MenuSelect attribute="merchantCity" />
              <h2 className="py-3 text-xl">Kategori</h2>
              <RefinementList
                attribute="_tags"
                classNames={{
                  count: " p-1 rounded-md ml-3",
                  labelText: "ml-3",
                  item: "mb-3",
                }}
              />
              <h2 className="py-3 text-xl">Rating</h2>
            </div>

            <div className="flex flex-col gap-6 w-full  max-h-full overflow-auto p-6 rounded-lg">
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
