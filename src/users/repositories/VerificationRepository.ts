import { BaseRepository } from "@/core/repositories/BaseRepository";
import { Prisma } from "@prisma/client";

export class VerificationRepository extends BaseRepository {
  static delete(verifId: string) {
    return this.db.verification.delete({ where: { verifId } });
  }

  static deleteMany(startDate: Date, endDate: Date) {
    return this.db.verification.deleteMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
    });
  }

  static findOne(verifId: string) {
    return this.db.verification.findUniqueOrThrow({ where: { verifId } });
  }

  static upsert(verifId: string, code: string) {
    return this.db.verification.upsert({
      where: { verifId },
      update: { code, createdAt: new Date() },
      create: { verifId, code },
    });
  }
}
