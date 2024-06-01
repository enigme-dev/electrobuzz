import { BaseRepository } from "@/core/repositories/BaseRepository";
import { TReviewModel } from "../types";
import { PER_PAGE, SearchParams } from "@/core/lib/utils";

export class ReviewRepository extends BaseRepository {
  static create(data: TReviewModel) {
    return this.db.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          reviewBody: data.reviewBody,
          reviewStars: data.reviewStars,
          booking: { connect: { bookingId: data.bookingId } },
          merchant: { connect: { merchantId: data.merchantId } },
          user: { connect: { id: data.userId } },
        },
      });

      const starsAvg = await tx.review.aggregate({
        where: { merchantId: data.merchantId },
        _avg: { reviewStars: true },
      });

      const merchant = await tx.merchant.update({
        where: { merchantId: data.merchantId },
        data: {
          merchantReviewCt: { increment: 1 },
          merchantRating: starsAvg._avg.reviewStars ?? 0,
        },
      });

      return merchant;
    });
  }

  static findMerchantReviews(merchantId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.review.findMany({
        orderBy: [
          {
            reviewCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          merchantId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
        select: {
          reviewId: true,
          reviewBody: true,
          reviewStars: true,
          reviewCreatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      this.db.review.count({
        where: {
          merchantId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
      }),
    ]);
  }

  static findMerchantReviewsDetail(merchantId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.review.findMany({
        orderBy: [
          {
            reviewCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          merchantId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
        select: {
          reviewId: true,
          reviewBody: true,
          reviewStars: true,
          reviewCreatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          booking: {
            select: {
              bookingId: true,
              bookingPhotoUrl: true,
              bookingComplain: true,
              bookingSchedule: true,
              bookingCreatedAt: true,
            },
          },
        },
      }),
      this.db.review.count({
        where: {
          merchantId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
      }),
    ]);
  }

  static findUserReviews(userId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.review.findMany({
        orderBy: [
          {
            reviewCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          userId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
        select: {
          reviewId: true,
          reviewBody: true,
          reviewStars: true,
          reviewCreatedAt: true,
          booking: {
            select: {
              bookingId: true,
              bookingPhotoUrl: true,
              bookingComplain: true,
              bookingSchedule: true,
              bookingCreatedAt: true,
            },
          },
        },
      }),
      this.db.review.count({
        where: {
          userId,
          reviewCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
      }),
    ]);
  }
}
