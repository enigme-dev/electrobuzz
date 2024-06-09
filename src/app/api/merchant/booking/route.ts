import { buildErr } from "@/core/lib/errors";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getMerchantBookings } from "@/bookings/services/BookingService";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest) {
  let bookings, bookingsCt;
  const token = await getToken({ req });

  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate, status, filterBy } =
    parseParams(searchParams);

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    [bookings, bookingsCt] = await getMerchantBookings(userId.data, {
      page: skip,
      startDate,
      endDate,
      status,
      filterBy,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr(
          "ErrForbidden",
          403,
          "user is not registered as merchant",
        );
      }
    }

    Logger.error("booking", "get merchant booking list error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: bookings, page, total: bookingsCt });
}
