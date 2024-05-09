import {prisma} from "@/core/adapters/prisma";

export default async function getBooking(merchantId: string, bookingId: string) {
  return prisma.booking.findUniqueOrThrow({
    where: {
      bookingId,
      merchantId
    }
  })
}