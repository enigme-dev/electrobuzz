import { createReview } from "@/bookings/services/ReviewService";
import { CreateReviewSchema } from "@/bookings/types";
import { ErrorCode, buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { IdParam, buildRes } from "@/core/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, { params }: IdParam) {
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

  const input = CreateReviewSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await createReview(bookingId.data, userId.data, input.data);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "booking does not exist");
        case "booking is not done":
          return buildErr("ErrConflict", 409, e.message);
        case "review has already exist":
          return buildErr("ErrConflict", 409, e.message);
      }
    }

    Logger.error("booking", "create review error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes("review created successfully");
}
