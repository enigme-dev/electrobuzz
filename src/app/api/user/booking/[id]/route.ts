import { getUserBooking } from "@/bookings/services/BookingService";
import { ErrorCode, buildErr } from "@/core/lib/errors";
import { IdParam, buildRes } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
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
    booking = await getUserBooking(userId.data, bookingId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "booking does not exist");
      }
    }
    console.log(e);

    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrNotFound) {
        return buildErr("ErrNotFound", 404, "booking does not exist");
      }
    }

    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: booking });
}
