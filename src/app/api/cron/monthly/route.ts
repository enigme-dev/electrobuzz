import { NextRequest } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { Logger } from "@/core/lib/logger";
import { chargeMonthlyFees } from "@/merchants/services/MerchantService";

async function handler(_req: NextRequest) {
  try {
    chargeMonthlyFees();
  } catch (e) {
    Logger.error("cron", "monthly cronjob error", e);
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
