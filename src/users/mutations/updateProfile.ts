import { prisma } from "@/core/adapters/prisma";
import { UpdateProfileModel } from "../types";

export default async function updateProfile(
  data: UpdateProfileModel,
  userId: string
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      phone: data.phone,
      phoneVerified: data.phoneVerified,
      image: data.image,
    },
  });
}
