import { AlgoliaClient } from "@/core/adapters/algolia";
import { MerchantModel } from "../types";

export default async function addMerchantIndex(data: MerchantModel) {
  const index = AlgoliaClient.initIndex("merchants");

  index.saveObject({
    merchantName: data.merchantName,
    merchantCity: data.merchantCity,
    _tags: data.merchantCategory,
    merchantPhotoUrl: data.merchantPhotoUrl,
    objectID: data.merchantId,
    isAvailable: data.merchantAvailable,
  });
}
