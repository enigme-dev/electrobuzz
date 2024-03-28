import { prisma } from "@/core/adapters/prisma";
import { MerchantIdentitiesModel } from "../types";

export default async function addMerchantIdentities(
  data: MerchantIdentitiesModel
) {
  return prisma.merchantIdentity.create({
    data: {
      identityKtp: data.identityKtp,
      identitySkck: data.identitySkck,
      identityCert: data.identityCert,
      identityStatus: data.identityStatus,
      merchant: {
        connect: {
          merchantId: data.merchantId,
        },
      },
    },
  });
}
