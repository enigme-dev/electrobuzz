import { BaseRepository } from "@/core/repositories/BaseRepository";
import { TUpsertMerchantBenefitSchema } from "../types";

export class MerchantBenefitRepository extends BaseRepository {
  static upsert(merchantId: string, data: TUpsertMerchantBenefitSchema) {
    return this.db.merchantBenefit.upsert({
      where: {
        merchantId_benefitType: {
          merchantId,
          benefitType: data.benefitType,
        },
      },
      update: {
        benefitBody: data.benefitBody,
      },
      create: {
        benefitType: data.benefitType,
        benefitBody: data.benefitBody,
        merchant: {
          connect: {
            merchantId,
          },
        },
      },
    });
  }
}
