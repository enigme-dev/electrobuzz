import { buildErr } from "@/core/lib/errors";
import { buildRes, parseParams } from "@/core/lib/utils";
import countMerchants from "@/merchants/queries/countMerchants";
import getMerchants from "@/merchants/queries/getMerchants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let merchants, merchantsCt;

  const searchParams = req.nextUrl.searchParams;
  const { query, page, skip } = parseParams(searchParams);

  try {
    merchants = await getMerchants({ query, page: skip });
    merchantsCt = await countMerchants({ query });
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: merchants, total: merchantsCt, page });
}
