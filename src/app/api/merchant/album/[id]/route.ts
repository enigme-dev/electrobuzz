import { buildErr } from "@/core/lib/errors";
import deleteMerchantAlbum from "@/merchantAlbums/mutations/deleteMerchantAlbums";
import getMerchantAlbums from "@/merchantAlbums/queries/getMerchantAlbums";
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

interface IdParams {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: IdParams) {
  let merchant, merchantAlbum;

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
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    merchantAlbum = await getMerchantAlbums(merchant.merchantId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant album not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  if (
    merchantAlbum.filter((obj) => obj.merchantAlbumId === merchantAlbumId.data)
      .length === 0
  ) {
    return buildErr("ErrForbidden", 403);
  }

  try {
    await deleteMerchantAlbum(merchant.merchantId);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "deleted successfully" });
}
