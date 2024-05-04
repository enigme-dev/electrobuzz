import { prisma } from "@/core/adapters/prisma";

export default async function getVerification(verifId: string) {
  return prisma.verification.findUnique({ where: { verifId } });
}
