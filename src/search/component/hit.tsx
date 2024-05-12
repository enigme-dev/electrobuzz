import MerchantsCard from "@/core/components/merchantsCard";
import { z } from "zod";

const SearchItem = z.object({
  merchantName: z.string(),
  merchantCity: z.string(),
  merchantPhotoUrl: z.string().url(),
  objectID: z.string().cuid(),
  __position: z.number(),
  _highlightResult: z.any(),
  _tags: z.string().array(),
  isAvailable: z.boolean(),
});

type SearchItem = z.infer<typeof SearchItem>;

export function Hit({ hit }: Readonly<{ hit: SearchItem }>) {
  return (
    <MerchantsCard
      imgSource={hit.merchantPhotoUrl}
      imgAlt={hit.merchantName}
      merchName={hit.merchantName}
      serviceCategory={hit._tags}
      location={hit.merchantCity}
      merchantId={hit.objectID}
    />
  );
}
