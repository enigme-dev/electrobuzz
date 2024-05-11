import {BaseRepository} from "@/core/repositories/BaseRepository";

export class VerificationRepository extends BaseRepository {
  static findOne(id: string) {
    return this.db.verification.findUniqueOrThrow({where: {verifId: id}})
  }

  static upsert(verifId: string, code: string) {
    return this.db.verification.upsert({
      where: {verifId},
      update: {code, createdAt: new Date()},
      create: {verifId, code},
    });
  }
}