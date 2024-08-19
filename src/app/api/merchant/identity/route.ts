import { buildErr, ErrorCode } from "@/core/lib/errors";
import { buildRes } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { MerchantIdentitiesSchema } from "@/merchants/types";
import {
  editMerchantIdentity,
  getMerchantIdentity,
} from "@/merchants/services/MerchantIdentityService";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  let merchantIdentity;
  try {
    merchantIdentity = await getMerchantIdentity(userId.data);
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

    Logger.error("merchant-identity", "get merchant identity error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: merchantIdentity });
}

export async function PATCH(req: NextRequest) {
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
    await editMerchantIdentity(userId.data, input.data);
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

    Logger.error("merchant-identity", "edit merchant identity error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "identities submitted successfully" });
}
