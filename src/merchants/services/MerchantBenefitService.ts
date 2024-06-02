import { MerchantBenefitRepository } from "../repositories/MerchantBenefitRepository";
import { TUpsertMerchantBenefitsSchema } from "../types";
import { Cache } from "@/core/lib/cache";

export async function upsertMerchantBenefits(
  merchantId: string,
  input: TUpsertMerchantBenefitsSchema
) {
  for (const benefit of input) {
    await MerchantBenefitRepository.upsert(merchantId, benefit);
  }

  // delete cached merchant
  Cache.delete(`merchant/${merchantId}`);
}
