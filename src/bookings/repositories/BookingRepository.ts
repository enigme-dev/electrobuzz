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
        address: {
          connect: {
            addressId: data.addressId,
          },
        },
      },
    });
  }

  static findByMerchantId(merchantId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.booking.findMany({
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          merchantId,
          bookingSchedule: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
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
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        where: {
          userId,
          bookingSchedule: { gte: options?.startDate, lte: options?.endDate },
          bookingStatus: options?.status,
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
