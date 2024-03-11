import { prisma } from "@/core/adapters/prisma";
import { AddressModel } from "../types";

export default async function addAddress(userId: string, data: AddressModel) {
  return prisma.address.create({
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
