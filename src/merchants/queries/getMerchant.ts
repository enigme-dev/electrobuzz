import { prisma } from "@/core/adapters/prisma";

export default async function getMerchant(merchantId: string) {
  return prisma.merchant.findUniqueOrThrow({
    where: {
      merchantId: merchantId,
    },
    include: {
      merchantAlbums: {
        select: { merchantAlbumId: true, albumPhotoUrl: true },
      },
    },
  });
}
