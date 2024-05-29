import { setStatusCanceled } from "@/bookings/services/BookingService";
import { BookingReasonSchema } from "@/bookings/types";
import { buildErr, ErrorCode } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { IdParam, buildRes } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function PATCH(req: NextRequest, { params }: IdParam) {
  let body;
  const token = await getToken({ req });

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const bookingId = z.string().cuid().safeParse(params.id);
  if (!bookingId.success) {
    return buildErr("ErrValidation", 400, "invalid booking id");
  }

  const input = BookingReasonSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await setStatusCanceled(userId.data, bookingId.data, input.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "booking does not exist");
      }
    }

    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrConflict:
          return buildErr(
            "ErrConflict",
            409,
            "can only cancel a pending or accepted booking"
          );
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "booking does not exist");
        case ErrorCode.ErrBookCancelation:
          return buildErr("ErrBookCancelation", 400, e.message);
      }
    }

    Logger.error("booking", "set user booking cancel error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes("booking updated successfully");
}
