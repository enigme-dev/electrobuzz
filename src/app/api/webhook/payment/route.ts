import { Logger } from "@/core/lib/logger";
import { buildRes } from "@/core/lib/utils";
import { verifyPayment } from "@/payments/services/PaymentService";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    verifyPayment(body);
  } catch (e) {
    Logger.error("payment", "payment webhook error", e);
  }

  return buildRes("ok");
}
