import { prisma } from "@/core/adapters/prisma";

export default async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: {
      userId: userId,
    },
    select: {
      addressId: true,
      addressDetail: true,
      addressZipCode: true,
      addressCity: true,
      addressProvince: true,
      userId: false,
      user: false,
    },
  });
}
