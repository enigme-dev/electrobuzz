import {buildErr} from "@/core/lib/errors";
import {buildRes, parseParams} from "@/core/lib/utils";
import countBookings from "@/merchants/queries/countBookings";
import getBookings from "@/merchants/queries/getBookings";
import {getMerchant} from "@/merchants/services/MerchantService";
import {Prisma} from "@prisma/client";
import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {z} from "zod";

export async function GET(req: NextRequest) {
  let merchant, bookings, bookingsCt;
  const token = await getToken({req});

  const searchParams = req.nextUrl.searchParams;
  const {page, skip, startDate, endDate} = parseParams(searchParams);

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    merchant = await getMerchant(userId.data);
    bookings = await getBookings(merchant.merchantId, {
      page: skip,
      startDate,
      endDate,
    });
    bookingsCt = await countBookings(merchant.merchantId, {
      startDate,
      endDate,
    });
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

  return buildRes({data: bookings, page, total: bookingsCt});
}
