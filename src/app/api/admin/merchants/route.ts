import { buildErr } from "@/core/lib/errors";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getMerchants } from "@/merchants/services/MerchantService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let merchants, merchantsCt;

  const searchParams = req.nextUrl.searchParams;
  const { query, page, skip } = parseParams(searchParams);

  try {
    [merchants, merchantsCt] = await getMerchants({ query, page: skip });
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: merchants, total: merchantsCt, page });
}
