import { prisma } from "@/core/adapters/prisma";
import { type BookingModel } from "../types";

export default async function addBooking(data: BookingModel) {
  return prisma.booking.create({
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
