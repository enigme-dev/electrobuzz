import { prisma } from "@/core/adapters/prisma";

export default async function getIdentities(query: string) {
  return prisma.merchant.findMany({
    where: {
      OR: [
        {
          merchantName: {
            contains: query,
          },
        },
        {
          merchantId: {
            contains: query,
          },
        },
      ],
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
