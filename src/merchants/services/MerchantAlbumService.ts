import { deleteImg, uploadImg } from "@/core/lib/image";
import { MerchantAlbumRepository } from "@/merchants/repositories/MerchantAlbumRepository";
import { TAlbumsSchema } from "@/merchants/types";
import { ErrorCode } from "@/core/lib/errors";
import { Prisma } from "@prisma/client";
import { getMerchant } from "./MerchantService";
import { Cache } from "@/core/lib/cache";

export async function addMerchantAlbums(
  merchantId: string,
  data: TAlbumsSchema
) {
  let images = [];

  const merchant = await getMerchant(merchantId);
  if (!merchant.merchantVerified) {
    throw new Error(ErrorCode.ErrMerchantUnverified);
  }

  try {
    for (const album of data.albums) {
      const imageUrl = await uploadImg(album.albumPhotoUrl);
      images.push(imageUrl);
    }

    const albums = images.map((image) => ({
      merchantId: merchantId,
      albumPhotoUrl: image,
    }));
    await MerchantAlbumRepository.createMany(merchantId, albums);

    // delete cached merchants
    Cache.delete(`merchant/${merchantId}`);
  } catch (e) {
    images.map((image) => deleteImg(image));
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw e;
    }

    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrAlbumQuotaExceeded) throw e;
    }

    throw new Error(ErrorCode.ErrImgFailedUpload);
  }

  return images;
}

export async function deleteMerchantAlbum(
  merchantId: string,
  merchantAlbumId: string
) {
  const album = await MerchantAlbumRepository.findOne(merchantAlbumId);
  if (album.merchantId !== merchantId) {
    throw new Error(ErrorCode.ErrForbidden);
  }

  await deleteImg(album.albumPhotoUrl);
  await MerchantAlbumRepository.delete(merchantAlbumId);

  // delete cached merchants
  Cache.delete(`merchant/${merchantId}`);
}

export async function getMerchantAlbum(merchantAlbumId: string) {
  return await MerchantAlbumRepository.findOne(merchantAlbumId);
}

export async function getMerchantAlbums(merchantId: string) {
  return await MerchantAlbumRepository.findAll(merchantId);
}
