import { buildErr, ErrorCode } from "@/core/lib/errors";
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
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    const merchant = await getMerchant(merchantId.data);
    return buildRes({ data: merchant });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
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
    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrMerchantUnverified) {
        return buildErr("ErrForbidden", 401, e.message);
      }
    }

    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes("merchant updated successfully");
}
