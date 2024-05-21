import { setStatusDone } from "@/bookings/services/BookingService";
import { buildErr, ErrorCode } from "@/core/lib/errors";
import { IdParam, buildRes } from "@/core/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function PATCH(req: NextRequest, { params }: IdParam) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const bookingId = z.string().cuid().safeParse(params.id);
  if (!bookingId.success) {
    return buildErr("ErrValidation", 400, "invalid booking id");
  }

  try {
    await setStatusDone(userId.data, bookingId.data);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrConflict:
          return buildErr(
            "ErrConflict",
            409,
            "can only done an in progress booking"
          );
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "booking does not exist");
        case ErrorCode.ErrBookDoneTooEarly:
          return buildErr("ErrBookDoneTooEarly", 400, e.message);
      }
    }

    return buildErr("ErrUnknown", 500);
  }

  return buildRes("booking updated successfully");
}
