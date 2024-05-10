import {prisma} from "@/core/adapters/prisma";

import {MerchantIdentitiesModel} from "@/merchants/types";

export default async function addMerchantIdentities(
  data: MerchantIdentitiesModel
) {
  return prisma.merchantIdentity.create({
    data: {
      identityKTP: data.identityKTP,
      identitySKCK: data.identitySKCK,
      identityDocs: data.identityDocs,
      identityStatus: data.identityStatus,
      merchant: {
        connect: {
          merchantId: data.merchantId,
        },
      },
    },
  });
}
