import {NextRequest} from "next/server";
import {buildRes, IdParam} from "@/core/lib/utils";
import {z} from "zod";
import {buildErr} from "@/core/lib/errors";
import {getToken} from "next-auth/jwt";
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";
import {Prisma} from "@prisma/client";
import getBooking from "@/merchants/queries/getBooking";

export async function GET(req: NextRequest, {params}: IdParam) {
  let merchant, booking;
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
    merchant = await getMerchantByUserId(userId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr(
          "ErrForbidden",
          403,
          "user is not registered as merchant"
        );
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    booking = await getBooking(merchant.merchantId, bookingId.data)
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({data: booking})
}