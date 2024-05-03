import { prisma } from "@/core/adapters/prisma";
import { SearchParams } from "@/core/lib/utils";

export default async function getMerchants(options?: SearchParams) {
  return prisma.merchant.findMany({
    skip: options?.page,
    take: 10,
    where: {
      merchantName: {
        contains: options?.query,
        mode: "insensitive",
      },
    },
    include: {
      merchantIdentity: {
        select: {
          identityStatus: true,
        },
      },
    },
  });
}
