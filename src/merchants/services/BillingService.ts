import { BillingRepository } from "../repositories/BillingRepository";
import { SearchParams } from "@/core/lib/utils";
import { TCreateBillingsSchema } from "../types";

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
  let toggle;
  if (options?.status === "paid") {
    toggle = true;
  } else if (options?.status === "unpaid") {
    toggle = false;
  }

  return await BillingRepository.findByMerchantId(merchantId, {
    ...options,
    toggle,
  });
}

export async function updateBillingPaid(
  billingId: string,
  billingPaid: boolean
) {
  return await BillingRepository.update(billingId, { billingPaid });
}
