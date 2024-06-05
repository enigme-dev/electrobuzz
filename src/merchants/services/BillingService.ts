import { BillingRepository } from "../repositories/BillingRepository";
import { SearchParams } from "@/core/lib/utils";
import { TBillingDetailSchema, TCreateBillingsSchema } from "../types";

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

export async function getBillings(options?: SearchParams) {
  let toggle;
  if (options?.status === "paid") {
    toggle = true;
  } else if (options?.status === "unpaid") {
    toggle = false;
  }

  return await BillingRepository.findAll({ ...options, toggle });
}

export async function getMerchantBilling(
  merchantId: string,
  billingId: string
) {
  const billing = await BillingRepository.findOne(merchantId, billingId);
  const result: TBillingDetailSchema = {
    billingId: billing.billingId,
    billingPaid: billing.billingPaid,
    billingAmount: billing.billingAmount,
    billingQty: billing.billingQty,
    billingCreatedAt: billing.billingCreatedAt,
    payment: {
      paymentId: billing.payment[0].paymentId,
      paymentStatus: billing.payment[0].paymentStatus,
      paymentAmount: billing.payment[0].paymentAmount,
      paymentMethod: billing.payment[0].paymentMethod,
      paymentBank: billing.payment[0].paymentBank,
      paymentDate: billing.payment[0].paymentDate,
      paymentCreatedAt: billing.payment[0].paymentCreatedAt,
    },
  };
  return result;
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
