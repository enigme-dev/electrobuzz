import { prisma } from "@/core/adapters/prisma";

export default async function addMerchantAlbums(
  merchantId: string,
  albumPhotoUrls: string[]
) {
  const photos = albumPhotoUrls.map((photo) => {
    return { merchantId: merchantId, albumPhotoUrl: photo };
  });

  return prisma.merchantAlbum.createMany({
    data: photos,
  });
}
