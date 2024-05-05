import { AlgoliaClient } from "@/core/adapters/algolia";
import { MerchantModel } from "../types";

export default async function addMerchantIndex(data: MerchantModel) {
  const index = AlgoliaClient.initIndex("merchants");

  index.saveObject({
    objectID: data.merchantId,
    _tags: data.merchantCategory,
    merchantName: data.merchantName,
    merchantPhotoUrl: data.merchantPhotoUrl,
    merchantCity: data.merchantCity,
    merchantLat: data.merchantLat,
    merchantLong: data.merchantLong,
    isAvailable: data.merchantAvailable,
  });
}
