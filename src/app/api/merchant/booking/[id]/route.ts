import { getMerchantBooking } from "@/bookings/services/BookingService";
import { buildErr } from "@/core/lib/errors";
import { IdParam, buildRes } from "@/core/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: IdParam) {
  let booking;
  const token = await getToken({ req });

  const bookingId = z.string().cuid().safeParse(params.id);
  if (!bookingId.success) {
    return buildErr("ErrValidation", 400, "invalid booking id");
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    booking = await getMerchantBooking(userId.data, bookingId.data);
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: booking });
}
