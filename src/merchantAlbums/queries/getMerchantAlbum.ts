import { prisma } from "@/core/adapters/prisma";

export default async function getMerchantAlbum(merchantAlbumId: string) {
  return prisma.merchantAlbum.findUniqueOrThrow({
    where: {
      merchantAlbumId: merchantAlbumId,
    },
  });
}
