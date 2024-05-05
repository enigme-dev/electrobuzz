import { prisma } from "@/core/adapters/prisma";
import { RegisterMerchantSchema } from "../types";

export async function addMerchant(
  merchantId: string,
  userId: string,
  data: RegisterMerchantSchema
) {
  return prisma.merchant.create({
    data: {
      merchantId: merchantId,
      merchantName: data.merchantName,
      merchantDesc: data.merchantDesc,
      merchantCity: data.merchantCity,
      merchantProvince: data.merchantProvince,
      merchantLat: data.merchantLat,
      merchantLong: data.merchantLong,
      merchantCategory: data.merchantCategory,
      merchantPhotoUrl: data.merchantPhotoUrl,
      merchantIdentity: {
        create: {
          identityStatus: data.merchantIdentity.identityStatus,
          identityKTP: data.merchantIdentity.identityKTP,
          identitySKCK: data.merchantIdentity.identitySKCK,
          identityDocs: data.merchantIdentity.identityDocs,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
