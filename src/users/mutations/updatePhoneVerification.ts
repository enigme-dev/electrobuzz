import { prisma } from "@/core/adapters/prisma";

export default async function updatePhoneVerification(
  userId: string,
  isVerified: boolean
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      phoneVerified: isVerified,
    },
  });
}
