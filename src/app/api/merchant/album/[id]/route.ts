import { buildErr } from "@/core/lib/errors";
import { deleteImg } from "@/core/lib/image";
import { buildRes } from "@/core/lib/utils";
import deleteMerchantAlbum from "@/merchantAlbums/mutations/deleteMerchantAlbums";
import getMerchantAlbum from "@/merchantAlbums/queries/getMerchantAlbum";
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

interface IdParams {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: IdParams) {
  let merchantAlbum, merchant;

  const token = await getToken({ req });
  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const merchantAlbumId = z.string().cuid().safeParse(params.id);
  if (!merchantAlbumId.success) {
    return buildErr("ErrValidation", 404, "invalid merchant album id");
  }

  try {
    merchant = await getMerchantByUserId(userId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr(
          "ErrForbidden",
          403,
          "user is not registered as merchant"
        );
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    merchantAlbum = await getMerchantAlbum(merchantAlbumId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant album not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  if (merchantAlbum.merchantId !== merchant.merchantId) {
    return buildErr("ErrNotFound", 404, "merchant album not found");
  }

  try {
    await deleteMerchantAlbum(merchantAlbumId.data);
    await deleteImg(merchantAlbumId.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "deleted successfully" });
}
