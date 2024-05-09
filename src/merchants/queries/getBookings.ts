import { prisma } from "@/core/adapters/prisma";
import { SearchParams } from "@/core/lib/utils";

export default async function getBookings(
  merchantId: string,
  options?: SearchParams
) {
  return prisma.booking.findMany({
    skip: options?.page,
    take: 10,
    where: {
      merchantId: merchantId,
      bookingCreatedAt: {
        gte: options?.startDate,
        lte: options?.endDate,
      },
    },
  });
}
