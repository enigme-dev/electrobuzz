import { buildErr } from "@/core/lib/errors";
import { NextRequest } from "next/server";
import { z } from "zod";
import { buildRes, IdParam } from "@/core/lib/utils";
import { Logger } from "@/core/lib/logger";
import { getPrivateProfile } from "@/users/services/UserService";

export async function GET(req: NextRequest, { params }: IdParam) {
  let result;
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    result = await getPrivateProfile(merchantId.data);
    if (!result) {
      return buildErr("ErrNotFound", 404);
    }
  } catch (e) {
    Logger.error("admin", "get merchant user profile error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: result });
}
