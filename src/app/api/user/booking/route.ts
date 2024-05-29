import { buildErr } from "@/core/lib/errors";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getUserBookings } from "@/bookings/services/BookingService";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest) {
  let bookings, bookingsCt;
  const token = await getToken({ req });

  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate, status } = parseParams(searchParams);

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    [bookings, bookingsCt] = await getUserBookings(userId.data, {
      page: skip,
      startDate,
      endDate,
      status,
    });
  } catch (e) {
    Logger.error("booking", "get user booking list error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: bookings, page, total: bookingsCt });
}
