"use client";

import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Menu } from "react-instantsearch";
import { z } from "zod";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

const SearchItem = z.object({
  merchantName: z.string(),
  merchantCity: z.string(),
  merchantPhotoUrl: z.string().url(),
  objectID: z.string().cuid(),
  __position: z.number(),
  _highlightResult: z.any(),
  _tags: z.string().array(),
});

type SearchItem = z.infer<typeof SearchItem>;

function Hit({ hit }: Readonly<{ hit: SearchItem }>) {
  return (
    <div className="flex gap-2 items-center p-2 mb-2 border border-slate-300 dark:border-slate-800 rounded-md">
      <img
        className="h-8 w-8"
        src={hit.merchantPhotoUrl}
        alt={hit.merchantName}
      />
      <div className="grid">
        <span>{hit.merchantName}</span>
        <span>{hit.merchantCity}</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="wrapper">
      <InstantSearch searchClient={searchClient} indexName="merchants">
        <SearchBox
          placeholder="Search for any services"
          classNames={{
            root: "shadow-sm w-full py-2",
            form: "flex",
            input:
              "grow px-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md",
            submitIcon: "hidden",
            resetIcon: "hidden",
          }}
        />
        <Menu attribute="merchantCity" />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}
