import { deleteImg, uploadImg } from "@/core/lib/image";
import { MerchantAlbumRepository } from "@/merchants/repositories/MerchantAlbumRepository";
import { TAlbumsSchema } from "@/merchants/types";
import { ErrorCode } from "@/core/lib/errors";
import { Prisma } from "@prisma/client";
import { getMerchant } from "./MerchantService";

export const ALBUM_QUOTA = 4;

export async function addMerchantAlbums(
  merchantId: string,
  data: TAlbumsSchema
) {
  let images = [];

  const merchant = await getMerchant(merchantId);
  if (!merchant.merchantVerified) {
    throw new Error(ErrorCode.ErrMerchantUnverified);
  }

  const totalAlbum = await MerchantAlbumRepository.count(merchantId);
  const quotaLeft = ALBUM_QUOTA - totalAlbum;
  if (quotaLeft < data.albums.length) {
    throw new Error(ErrorCode.ErrAlbumQuotaExceeded);
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
    await MerchantAlbumRepository.createMany(albums);
  } catch (e) {
    images.map((image) => deleteImg(image));
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw e;
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
}

export async function getMerchantAlbum(merchantAlbumId: string) {
  return await MerchantAlbumRepository.findOne(merchantAlbumId);
}

export async function getMerchantAlbums(merchantId: string) {
  return await MerchantAlbumRepository.findAll(merchantId);
}
