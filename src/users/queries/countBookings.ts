import { prisma } from "@/core/adapters/prisma";
import { SearchParams } from "@/core/lib/utils";

export default async function countBookings(
  userId: string,
  options?: SearchParams
) {
  return prisma.booking.count({
    where: {
      userId: userId,
      bookingCreatedAt: {
        gte: options?.startDate,
        lte: options?.endDate,
      },
    },
  });
}
