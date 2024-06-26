import { buildErr } from "@/core/lib/errors";
import {
  editMerchantIdentity,
  getMerchantIdentity,
} from "@/merchants/services/MerchantIdentityService";
import { NextRequest } from "next/server";
import { z } from "zod";
import { buildRes, IdParam } from "@/core/lib/utils";
import { EditMerchantIdentitySchema } from "@/merchants/types";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest, { params }: IdParam) {
  let result;
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    result = await getMerchantIdentity(merchantId.data);
    if (!result) {
      return buildErr("ErrNotFound", 404);
    }
  } catch (e) {
    Logger.error("admin", "get merchant identity error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: result });
}

export async function PATCH(req: NextRequest, { params }: IdParam) {
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const input = EditMerchantIdentitySchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await editMerchantIdentity(merchantId.data, input.data.identityStatus);
  } catch (e) {
    Logger.error("admin", "update merchant identity error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "merchant updated successfully" });
}
