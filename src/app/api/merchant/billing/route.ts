import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getMerchantBillings } from "@/merchants/services/BillingService";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  let billings, billingsCt;
  const token = await getToken({ req });

  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate, status } = parseParams(searchParams);

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    [billings, billingsCt] = await getMerchantBillings(userId.data, {
      page: skip,
      startDate,
      endDate,
      status,
    });
  } catch (e) {
    Logger.error("billing", "get billings error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: billings, page, total: billingsCt });
}
