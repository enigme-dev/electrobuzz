import { BillingRepository } from "../repositories/BillingRepository";
import { SearchParams } from "@/core/lib/utils";
import {
  BillingStatusEnum,
  TBillingStatusEnum,
  TCreateBillingsSchema,
} from "../types";

export const MONTHLY_FEES = 5000;

export async function createBilling(
  merchantId: string,
  billingAmount: number,
  billingQty: number
) {
  return await BillingRepository.create({
    merchantId,
    billingAmount,
    billingQty,
    billingStatus: BillingStatusEnum.Enum.pending,
  });
}

export async function createBillings(input: TCreateBillingsSchema) {
  return await BillingRepository.createMany(input);
}

export async function getMerchantBilling(
  merchantId: string,
  billingId: string
) {
  return await BillingRepository.findOne(merchantId, billingId);
}

export async function getMerchantBillings(
  merchantId: string,
  options?: SearchParams
) {
  return await BillingRepository.findByMerchantId(merchantId, options);
}

export async function updateBillingStatus(
  billingId: string,
  billingStatus: TBillingStatusEnum
) {
  return await BillingRepository.update(billingId, { billingStatus });
}
