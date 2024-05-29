import { getMerchantReviews } from "@/bookings/services/ReviewService";
import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { IdParam, buildRes, parseParams } from "@/core/lib/utils";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: IdParam) {
  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate, status } = parseParams(searchParams);

  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    const [reviews, reviewsCt] = await getMerchantReviews(merchantId.data, {
      page: skip,
      startDate,
      endDate,
      status,
    });
    return buildRes({ data: reviews, page, total: reviewsCt });
  } catch (e) {
    Logger.error("review", "get merchant reviews error", e);
    return buildErr("ErrUnknown", 500);
  }
}
