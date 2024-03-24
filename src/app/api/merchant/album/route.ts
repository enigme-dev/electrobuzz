import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import addMerchantAlbums from "@/merchantAlbums/mutations/addMerchantAlbums";
import getMerchantAlbums from "@/merchantAlbums/queries/getMerchantAlbums";
import { AlbumsSchema } from "@/merchantAlbums/types";
import { removeImagePrefix } from "@/merchants/lib/utils";
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  let body,
    merchant,
    photos: string[] = [];

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const data = AlbumsSchema.safeParse(body);
  if (!data.success) {
    return buildErr("ErrValidation", 400, data.error);
  }

  try {
    merchant = await getMerchantByUserId(userId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    const merchantAlbum = await getMerchantAlbums(merchant.merchantId);
    const albumQuota = 4 - merchantAlbum.length;
    if (albumQuota < data.data.albums.length) {
      return buildErr(
        "ErrConflict",
        409,
        "album cannot contain more than 4 photos"
      );
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  try {
    for (const album of data.data.albums) {
      const imageUrl = await uploadImg(album.albumPhotoUrl, 640);
      photos.push(imageUrl);
    }

    await addMerchantAlbums(merchant.merchantId, photos);
  } catch (e) {
    photos.map((photo) => {
      deleteImg(removeImagePrefix(photo));
    });

    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "uploaded successfully", data: photos });
}
