import {buildErr} from "@/core/lib/errors";
import {buildRes, parseParams} from "@/core/lib/utils";
import {countUserBookings, getUserBookings} from "@/bookings/services/BookingService";
import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {z} from "zod";

export async function GET(req: NextRequest) {
  let bookings, bookingsCt;
  const token = await getToken({req});

  const searchParams = req.nextUrl.searchParams;
  const {page, skip, startDate, endDate} = parseParams(searchParams);

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    bookings = await getUserBookings(userId.data, {page: skip, startDate, endDate});

    bookingsCt = await countUserBookings(userId.data, {startDate, endDate});
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({data: bookings, page, total: bookingsCt});
}
