import { setStatusInProgressRequested } from "@/bookings/services/BookingService";
import { ErrorCode, buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
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
    await setStatusInProgressRequested(userId.data, bookingId.data);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrConflict:
          return buildErr(
            "ErrConflict",
            409,
            "can only set in progress an accepted booking"
          );
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "booking does not exist");
        case ErrorCode.ErrBookWrongSchedule:
          return buildErr("ErrBookWrongSchedule", 409, e.message);
      }
    }

    Logger.error("booking", "set merchant booking in progress error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes("booking updated successfully");
}
