import { buildErr, ErrorCode } from "@/core/lib/errors";
import { buildRes } from "@/core/lib/utils";
import { addMerchantAlbums } from "@/merchants/services/MerchantAlbumService";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { AlbumsSchema } from "@/merchants/types";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  let body;
  const token = await getToken({ req });

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
    await addMerchantAlbums("casdgljkwqheroiu23", data.data);
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

    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrMerchantUnverified:
          return buildErr("ErrForbidden", 401, e.message);
        case ErrorCode.ErrImgInvalidDataURL:
          return buildErr("ErrImgInvalidDataURL", 400);
        case ErrorCode.ErrImgInvalidImageType:
          return buildErr("ErrImgInvalidImageType", 400);
        case ErrorCode.ErrAlbumQuotaExceeded:
          return buildErr("ErrAlbumQuotaExceeded", 409, e.message);
      }
    }

    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "albums uploaded successfully" });
}
