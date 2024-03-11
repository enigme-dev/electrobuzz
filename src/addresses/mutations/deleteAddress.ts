import { prisma } from "@/core/adapters/prisma";

export default async function deleteAddress(addressId: string) {
  return prisma.address.delete({
    where: {
      addressId: addressId,
    },
  });
}
