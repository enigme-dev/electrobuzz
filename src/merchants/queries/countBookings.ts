import { prisma } from "@/core/adapters/prisma";
import { SearchParams } from "@/core/lib/utils";

export default async function countBookings(
  merchantId: string,
  options?: SearchParams
) {
  return prisma.booking.count({
    where: {
      merchantId: merchantId,
      bookingCreatedAt: {
        gte: options?.startDate,
        lte: options?.endDate,
      },
    },
  });
}
