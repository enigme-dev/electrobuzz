import { prisma } from "@/core/adapters/prisma";

export default async function addVerification(verifId: string, code: string) {
  return prisma.verification.upsert({
    where: { verifId },
    update: { code, createdAt: new Date() },
    create: { verifId, code },
  });
}
