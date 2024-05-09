import { prisma } from "@/core/adapters/prisma";
import { UpdateProfileModel } from "../types";

export default async function updateProfile(
  userId: string,
  data: UpdateProfileModel
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      phone: data.phone,
      image: data.image,
    },
  });
}
