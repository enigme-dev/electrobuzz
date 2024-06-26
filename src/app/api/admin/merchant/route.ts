import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getMerchantsAdmin } from "@/merchants/services/MerchantService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let merchants, merchantsCt;

  const searchParams = req.nextUrl.searchParams;
  const { query, page, skip, status } = parseParams(searchParams);

  try {
    [merchants, merchantsCt] = await getMerchantsAdmin({
      query,
      page: skip,
      status,
    });
  } catch (e) {
    Logger.error("admin", "get merchant list error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: merchants, total: merchantsCt, page });
}
