import { buildErr } from "@/core/lib/errors";
import { deleteImg } from "@/core/lib/image";
import deleteMerchantAlbum from "@/merchantAlbums/mutations/deleteMerchantAlbums";
import getMerchantAlbum from "@/merchantAlbums/queries/getMerchantAlbum";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

interface IdParams {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: IdParams) {
  let merchantAlbum;

  const token = await getToken({ req });
  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const merchantId = z.string().cuid().safeParse(token?.merchantId);
  if (!merchantId.success) {
    return buildErr("ErrForbidden", 403, "not registered as merchant");
  }

  const merchantAlbumId = z.string().cuid().safeParse(params.id);
  if (!merchantAlbumId.success) {
    return buildErr("ErrValidation", 404, "invalid merchant album id");
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

  if (merchantAlbum.merchantId !== merchantId.data) {
    return buildErr("ErrNotFound", 404, "merchant album not found");
  }

  try {
    await deleteMerchantAlbum(merchantAlbumId.data);
    await deleteImg(merchantAlbumId.data);
  } catch (e) {
    console.log(e);
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "deleted successfully" });
}
