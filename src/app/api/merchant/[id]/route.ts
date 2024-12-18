import { Cache } from "@/core/lib/cache";
import { buildErr, ErrorCode } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, IdParam } from "@/core/lib/utils";
import {
  getMerchant,
  updateMerchantProfile,
} from "@/merchants/services/MerchantService";
import { UpdateMerchantSchema } from "@/merchants/types";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: IdParam) {
  let merchant;
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    merchant = await Cache.get(`merchant/${merchantId.data}`);
    if (merchant) {
      return buildRes({ data: merchant });
    }

    merchant = await getMerchant(merchantId.data);
    Cache.set(`merchant/${merchantId.data}`, merchant);
    return buildRes({ data: merchant });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    Logger.error("merchant", "get merchant error", e);
    return buildErr("ErrUnknown", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: IdParam) {
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

  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  if (userId.data !== merchantId.data) {
    return buildErr("ErrForbidden", 403, "merchant id mismatch");
  }

  const input = UpdateMerchantSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await updateMerchantProfile(merchantId.data, input.data);
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
      if (e.message === ErrorCode.ErrMerchantUnverified) {
        return buildErr("ErrForbidden", 401, e.message);
      }
    }

    Logger.error("merchant", "update merchant error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes("merchant updated successfully");
}
