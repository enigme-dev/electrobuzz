import { z } from "zod";

export const BillingModel = z.object({
  billingId: z.string().cuid(),
  billingAmount: z.number(),
  billingQty: z.number(),
  billingCreatedAt: z.date(),
  merchantId: z.string().cuid(),
});

export type TBillingModel = z.infer<typeof BillingModel>;

export const PaymentStatusEnum = z.enum([
  "pending",
  "success",
  "failed",
  "expired",
]);

export type TPaymentStatusEnum = z.infer<typeof PaymentStatusEnum>;

export const PaymentModel = z.object({
  paymentId: z.string().cuid(),
  paymentStatus: PaymentStatusEnum,
  paymentMethod: z.string().nullish(),
  paymentDate: z.date().nullish(),
  paymentToken: z.string().nullish(),
  paymentCreatedAt: z.date(),
  billingId: z.string().cuid(),
});

export type TPaymentModel = z.infer<typeof PaymentModel>;
