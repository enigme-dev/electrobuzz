import { prisma } from "@/core/adapters/prisma";

export default async function getPublicProfile(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      name: true,
      image: true,
    },
  });
}
