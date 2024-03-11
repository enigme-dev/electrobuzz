import { prisma } from "@/core/adapters/prisma";

export default async function GetPrivateProfile(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}
