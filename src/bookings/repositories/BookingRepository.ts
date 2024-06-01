import { BaseRepository } from "@/core/repositories/BaseRepository";
import { BookStatusEnum, TBookingModel } from "@/bookings/types";
import { PER_PAGE, SearchParams } from "@/core/lib/utils";
import { Prisma } from "@prisma/client";
import { ErrorCode } from "@/core/lib/errors";

export class BookingRepository extends BaseRepository {
  static create(data: TBookingModel) {
    return this.db.booking.create({
      data: {
        bookingPhotoUrl: data.bookingPhotoUrl,
        bookingComplain: data.bookingComplain,
        bookingSchedule: data.bookingSchedule,
        bookingStatus: data.bookingStatus ?? "",
        addressDetail: data.addressDetail as string,
        addressZipCode: data.addressZipCode as string,
        addressCity: data.addressCity as string,
        addressProvince: data.addressProvince as string,
        user: {
          connect: {
            id: data.userId,
          },
        },
        merchant: {
          connect: {
            merchantId: data.merchantId,
          },
        },
      },
    });
  }

  static findByMerchantId(merchantId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.booking.findMany({
        orderBy: [
          {
            bookingCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          merchantId,
          bookingCreatedAt: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
        },
        select: {
          bookingId: true,
          bookingStatus: true,
          bookingComplain: true,
          bookingPhotoUrl: true,
          bookingPriceMin: true,
          bookingPriceMax: true,
          bookingSchedule: true,
          bookingCreatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      this.db.booking.count({
        where: {
          merchantId,
          bookingSchedule: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
        },
      }),
    ]);
  }

  static findByUserId(userId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.booking.findMany({
        orderBy: [
          {
            bookingCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          userId,
          bookingCreatedAt: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
        },
        select: {
          bookingId: true,
          bookingStatus: true,
          bookingComplain: true,
          bookingPhotoUrl: true,
          bookingPriceMin: true,
          bookingPriceMax: true,
          bookingSchedule: true,
          bookingCreatedAt: true,
          merchant: {
            select: {
              merchantId: true,
              merchantName: true,
              merchantPhotoUrl: true,
            },
          },
        },
      }),
      this.db.booking.count({
        where: {
          userId,
          bookingSchedule: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
        },
      }),
    ]);
  }

  static findOne(id: string, include?: Prisma.BookingInclude) {
    return this.db.booking.findUniqueOrThrow({
      where: { bookingId: id },
      include,
    });
  }

  static findUserReviews(userId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.booking.findMany({
        orderBy: [
          {
            bookingCreatedAt: "desc",
          },
        ],
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          userId,
          bookingCreatedAt: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: BookStatusEnum.Enum.done,
        },
        select: {
          bookingId: true,
          bookingStatus: true,
          bookingComplain: true,
          bookingPhotoUrl: true,
          bookingPriceMin: true,
          bookingPriceMax: true,
          bookingSchedule: true,
          bookingCreatedAt: true,
          merchant: {
            select: {
              merchantId: true,
              merchantName: true,
              merchantPhotoUrl: true,
            },
          },
          review: {
            select: {
              reviewId: true,
              reviewStars: true,
              reviewBody: true,
              reviewCreatedAt: true,
            },
          },
        },
      }),
      this.db.booking.count({
        where: {
          userId,
          bookingSchedule: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: BookStatusEnum.Enum.done,
        },
      }),
    ]);
  }

  static updateManyStatus(
    status: BookStatusEnum,
    where: Prisma.BookingWhereInput
  ) {
    return this.db.booking.updateMany({
      data: { bookingStatus: status },
      where,
    });
  }

  static updateMerchantBookingStatus(
    merchantId: string,
    bookingId: string,
    prevStatus: BookStatusEnum[],
    data: Prisma.BookingUpdateInput
  ) {
    return this.db.$transaction(
      async (tx) => {
        const booking = await tx.booking.findUniqueOrThrow({
          where: { bookingId },
        });

        if (booking.merchantId !== merchantId) {
          throw new Error(ErrorCode.ErrNotFound);
        }

        const status = BookStatusEnum.parse(booking.bookingStatus);
        if (!prevStatus.includes(status)) {
          throw new Error(ErrorCode.ErrConflict);
        }

        return tx.booking.update({
          where: { bookingId },
          data,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }

  static updateUserBookingStatus(
    userId: string,
    bookingId: string,
    prevStatus: BookStatusEnum[],
    data: Prisma.BookingUpdateInput
  ) {
    return this.db.$transaction(
      async (tx) => {
        const booking = await tx.booking.findUniqueOrThrow({
          where: { bookingId },
        });

        if (booking.userId !== userId) {
          throw new Error(ErrorCode.ErrNotFound);
        }

        const status = BookStatusEnum.parse(booking.bookingStatus);
        if (!prevStatus.includes(status)) {
          throw new Error(ErrorCode.ErrConflict);
        }

        return tx.booking.update({
          where: { bookingId },
          data,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }
}
