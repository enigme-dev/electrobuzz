import { buildErr, ErrorCode } from "@/core/lib/errors";
import { buildRes } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { MerchantIdentitiesSchema } from "@/merchants/types";
import { addMerchantIdentity } from "@/merchants/services/MerchantIdentityService";
import { Logger } from "@/core/lib/logger";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  let body;

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const input = MerchantIdentitiesSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await addMerchantIdentity(userId.data, input.data);
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
      if (e.message === ErrorCode.ErrImgInvalidDataURL) {
        return buildErr("ErrImgInvalidDataURL", 400);
      }

      if (e.message === ErrorCode.ErrImgInvalidImageType) {
        return buildErr("ErrImgInvalidImageType", 400);
      }

      if (e.message === ErrorCode.ErrConflict) {
        return buildErr("ErrConflict", 409, "identities has not been rejected");
      }
    }

    Logger.error("merchant-identity", "add merchant identity error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "identities submitted successfully" });
}
