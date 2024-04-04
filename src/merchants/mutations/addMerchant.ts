import { prisma } from "@/core/adapters/prisma";
import { MerchantModel } from "../types";

export async function addMerchant(userId: string, data: MerchantModel) {
  return prisma.merchant.create({
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
}
