import { getMerchantReviews } from "@/bookings/services/ReviewService";
import { Cache } from "@/core/lib/cache";
import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { IdParam, buildRes, parseParams } from "@/core/lib/utils";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: IdParam) {
  let reviews, reviewsCt;
  const searchParams = req.nextUrl.searchParams;
  const { page, skip, startDate, endDate } = parseParams(searchParams);

  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    reviews = Cache.get(
      `merchant_reviews/${merchantId.data}/${page}/${startDate}/${endDate}`
    );
    reviewsCt = Cache.get<number>(`merchant_reviews/${merchantId.data}`);

    if (!reviews || !reviewsCt) {
      [reviews, reviewsCt] = await getMerchantReviews(merchantId.data, {
        page: skip,
        startDate,
        endDate,
      });

      Cache.set(
        `merchant_reviews/${merchantId.data}/${page}/${startDate}/${endDate}`,
        reviews
      );
      Cache.set(`merchant_reviews/${merchantId.data}`, reviewsCt);
    }

    return buildRes({ data: reviews, page, total: reviewsCt });
  } catch (e) {
    Logger.error("review", "get merchant reviews error", e);
    return buildErr("ErrUnknown", 500);
  }
}
