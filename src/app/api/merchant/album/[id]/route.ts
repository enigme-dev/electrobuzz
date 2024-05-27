import { buildErr, ErrorCode } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, IdParam } from "@/core/lib/utils";
import { deleteMerchantAlbum } from "@/merchants/services/MerchantAlbumService";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function DELETE(req: NextRequest, { params }: IdParam) {
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
    await deleteMerchantAlbum(userId.data, merchantAlbumId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "album photo not found");
      }
    }

    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrForbidden) {
        return buildErr("ErrNotFound", 404, "album photo not found");
      }
    }

    Logger.error("merchant-album", "delete merchant album error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "album photo deleted successfully" });
}
