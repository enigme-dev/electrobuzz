import {BaseRepository} from "@/core/repositories/BaseRepository";
import {TBookingModel} from "@/bookings/types";
import {SearchParams} from "@/core/lib/utils";

export class BookingRepository extends BaseRepository {
  static countByMerchantId(merchantId: string, options?: SearchParams) {
    return this.db.booking.count({
      where: {merchantId, bookingSchedule: {gte: options?.startDate, lte: options?.endDate}}
    })
  }

  static countByUserId(userId: string, options?: SearchParams) {
    return this.db.booking.count({
      where: {userId, bookingSchedule: {gte: options?.startDate, lte: options?.endDate}}
    })
  }

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
    })
  }

  static findByMerchantId(merchantId: string, options?: SearchParams) {
    return this.db.booking.findMany({
      skip: options?.page,
      take: 10,
      where: {merchantId, bookingSchedule: {gte: options?.startDate, lte: options?.endDate}}
    })
  }

  static findByUserId(userId: string, options?: SearchParams) {
    return this.db.booking.findMany({
      skip: options?.page,
      take: 10,
      where: {userId, bookingSchedule: {gte: options?.startDate, lte: options?.endDate}}
    })
  }
}