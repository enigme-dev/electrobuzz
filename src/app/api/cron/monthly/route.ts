import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes } from "@/core/lib/utils";
import { chargeMonthlyFees } from "@/merchants/services/MerchantService";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    chargeMonthlyFees();
  } catch (e) {
    Logger.error("billing", "charge monthly fees error", e);
    return buildErr("ErrUnknown", 500);
  }
  return buildRes("ok");
}
