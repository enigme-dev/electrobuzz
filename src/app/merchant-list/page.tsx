"use client";

import MerchantCard from "@/core/components/dashboard/teknisi-terdekat/components/merchantCard";
import { Hit } from "@/merchant-list/component/hit";
import { MenuSelect } from "@/merchant-list/component/menuSelect";
import algoliasearch from "algoliasearch/lite";
import { Search, SearchCheckIcon } from "lucide-react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Menu,
  RefinementList,
  useInstantSearch,
} from "react-instantsearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

export default function Page() {
  return (
    <div className="grid wrapper h-[100vh] py-10 ">
      <InstantSearch searchClient={searchClient} indexName="merchants" routing>
        <div className="flex gap-10 w-full rounded-md shadow-xl px-8 border">
          <div className="py-6 h-full">
            <h2 className="pb-3 text-xl">Kota</h2>
            <MenuSelect attribute="merchantCity" />
            <h2 className="py-3 text-xl">Kategori</h2>
            <RefinementList
              attribute="_tags"
              classNames={{
                count: "bg-yellow-100 p-1 rounded-md ml-3",
                labelText: "ml-3",
                item: "mb-3",
              }}
            />
          </div>
          <div className="flex flex-col gap-6 py-6 w-full">
            <div className="flex border gap-2 items-center rounded-lg px-6">
              <SearchBox
                placeholder="Search for any services"
                classNames={{
                  root: "rounded-lg w-full h-fit ",
                  form: "flex",
                  input: "grow py-3 outline-none",
                  submitIcon: "hidden",
                  resetIcon: "hidden",
                  loadingIcon: "hidden",
                }}
              />
              <Search />
            </div>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits hitComponent={Hit} classNames={{ list: "grid gap-2" }} />
            </NoResultsBoundary>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

function NoResultsBoundary({ children, fallback }: any) {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="">
      <p>
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}
