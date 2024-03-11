import { prisma } from "@/core/adapters/prisma";

export default async function getAddress(addressId: string) {
  return prisma.address.findUnique({
    where: {
      addressId: addressId,
    },
    select: {
      addressId: true,
      addressDetail: true,
      addressZipCode: true,
      addressCity: true,
      addressProvince: true,
      userId: true,
      user: false,
    },
  });
}
