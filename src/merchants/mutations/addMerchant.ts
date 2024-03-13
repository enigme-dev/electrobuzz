import { prisma } from "@/core/adapters/prisma";
import { MerchantSchema } from "../types";
import { AlgoliaClient } from "@/core/adapters/algolia";

export async function addMerchant(userId: string, data: MerchantSchema) {
  return prisma.$transaction(async (tx) => {
    const created = await tx.merchant.create({
      data: {
        merchantName: data.merchantName,
        merchantDesc: data.merchantDesc,
        merchantCity: data.merchantCity,
        merchantProvince: data.merchantProvince,
        merchantCategory: data.merchantCategory,
        merchantPhotoUrl: data.merchantPhotoUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const index = AlgoliaClient.initIndex("merchants");
    index.saveObject({
      merchantName: data.merchantName,
      merchantCity: data.merchantCity,
      _tags: data.merchantCategory,
      merchantPhotoUrl: data.merchantPhotoUrl,
      objectID: created.merchantId,
    });
  });
}
