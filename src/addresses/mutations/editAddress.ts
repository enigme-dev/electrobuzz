import { prisma } from "@/core/adapters/prisma";
import { AddressModel } from "../types";

export default async function editAddress(
  userId: string,
  addressId: string,
  data: AddressModel
) {
  return prisma.address.update({
    where: {
      addressId: addressId,
    },
    data: {
      addressDetail: data.addressDetail,
      addressZipCode: data.addressZipCode,
      addressCity: data.addressCity,
      addressProvince: data.addressProvince,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
