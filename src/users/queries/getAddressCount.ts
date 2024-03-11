import { prisma } from "@/core/adapters/prisma";

export default async function getAddressCount(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          addresses: true,
        },
      },
    },
  });
}
