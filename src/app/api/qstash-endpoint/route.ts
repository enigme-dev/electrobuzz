import { NextRequest } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { deleteExpiredOTP } from "@/users/services/VerificationService";
import { Logger } from "@/core/lib/logger";

async function handler(_req: NextRequest) {
  try {
    await deleteExpiredOTP();
  } catch (e) {
    Logger.error("cron", "qstash cron handler error", e);
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
