import { prisma } from "@/core/adapters/prisma";
import { SearchParams } from "@/core/lib/utils";

export default async function countMerchants(options?: SearchParams) {
  return prisma.merchant.count({
    where: {
      merchantName: {
        contains: options?.query,
        mode: "insensitive",
      },
    },
  });
}
