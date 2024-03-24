import { prisma } from "@/core/adapters/prisma";

export default async function getMerchantAlbums(merchantId: string) {
  return prisma.merchantAlbum.findMany({
    where: {
      merchantId: merchantId,
    },
  });
}
