import { NextRequest } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { Logger } from "@/core/lib/logger";
import {
  flagDoneInProgressBooking,
  flagExpiredAcceptedBooking,
  flagExpiredPendingBooking,
} from "@/bookings/services/BookingService";

async function handler(_req: NextRequest) {
  try {
    flagDoneInProgressBooking();
    flagExpiredAcceptedBooking();
    flagExpiredPendingBooking();
  } catch (e) {
    Logger.error("cron", "qstash cron handler error", e);
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
