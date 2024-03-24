import { prisma } from "@/core/adapters/prisma";

export default async function getMerchantByUserId(userId: string) {
  return prisma.merchant.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
}
