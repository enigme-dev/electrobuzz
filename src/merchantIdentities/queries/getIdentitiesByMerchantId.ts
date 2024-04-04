import { prisma } from "@/core/adapters/prisma";

export default async function getIdentitiesByMerchantId(merchantId: string) {
  return prisma.merchantIdentity.findUnique({
    where: {
      merchantId: merchantId,
    },
  });
}
