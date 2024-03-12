import { prisma } from "@/core/adapters/prisma";

export default async function getPrivateProfile(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}
