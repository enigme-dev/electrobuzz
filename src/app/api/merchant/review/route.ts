import { getMerchantReviewsDetail } from "@/bookings/services/ReviewService";
import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate } = parseParams(searchParams);

  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    const [reviews, reviewsCt] = await getMerchantReviewsDetail(userId.data, {
      page: skip,
      startDate,
      endDate,
    });
    return buildRes({ data: reviews, page, total: reviewsCt });
  } catch (e) {
    Logger.error("review", "get merchant reviews error", e);
    return buildErr("ErrUnknown", 500);
  }
}
