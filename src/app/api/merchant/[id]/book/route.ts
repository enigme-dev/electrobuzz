import { addBooking } from "@/bookings/services/BookingService";
import { CreateBookingSchema } from "@/bookings/types";
import { buildErr, ErrorCode } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, IdParam } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, { params }: IdParam) {
  let body, result: any;
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

  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  const input = CreateBookingSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    result = await addBooking(userId.data, merchantId.data, input.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant does not exist");
      }
    }

    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrImgInvalidDataURL:
          return buildErr("ErrImgInvalidDataURL", 400);
        case ErrorCode.ErrImgInvalidImageType:
          return buildErr("ErrImgInvalidImageType", 400);
        case "user can not book their own merchant":
          return buildErr("ErrConflict", 409, e.message);
        case "user does not own this address":
          return buildErr("ErrValidation", 400, "address does not exist");
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "merchant does not exist");
        case ErrorCode.ErrBookInvalidSchedule:
          return buildErr("ErrValidation", 400, e.message);
        case ErrorCode.ErrTooManyRequest:
          return buildErr(
            "ErrTooManyRequest",
            429,
            "can not have more than 5 pending booking"
          );
        case "phone is not registered":
          return buildErr("ErrForbidden", 403, e.message);
      }
    }

    Logger.error("merchant", "book merchant error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({
    status: "booking added successfully",
    data: { bookingId: result.bookingId },
  });
}
