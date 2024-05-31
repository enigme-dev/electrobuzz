import { z } from "zod";

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
  paymentToken: z.string(),
  paymentAmount: z.number().nullish(),
  paymentMethod: z.string().nullish(),
  paymentBank: z.string().nullish(),
  paymentDate: z.date().nullish(),
  paymentCreatedAt: z.date(),
  billingId: z.string().cuid(),
});

export type TPaymentModel = z.infer<typeof PaymentModel>;

export const CreatePaymentSchema = PaymentModel.pick({
  paymentStatus: true,
  paymentToken: true,
  billingId: true,
});

export type TCreatePaymentSchema = z.infer<typeof CreatePaymentSchema>;

export const UpdatePaymentSchema = z
  .object({
    paymentStatus: PaymentStatusEnum,
    paymentAmount: z.number(),
    paymentMethod: z.string(),
    paymentBank: z.string(),
    paymentDate: z.date(),
  })
  .partial();

export type TUpdatePaymentSchema = z.infer<typeof UpdatePaymentSchema>;
