import { prisma } from "@/core/adapters/prisma";

export default async function deleteMerchantAlbum(merchantAlbumId: string) {
  return prisma.merchantAlbum.delete({
    where: {
      merchantAlbumId: merchantAlbumId,
    },
  });
}
