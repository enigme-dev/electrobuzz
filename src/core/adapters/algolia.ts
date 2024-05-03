import algoliasearch from "algoliasearch";

export const AlgoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_API_KEY as string
);
