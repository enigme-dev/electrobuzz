import { BaseRepository } from "@/core/repositories/BaseRepository";
import { TCreatePaymentSchema, TUpdatePaymentSchema } from "../types";

export class PaymentRepository extends BaseRepository {
  static create(data: TCreatePaymentSchema) {
    return this.db.payment.create({
      data: {
        paymentStatus: data.paymentStatus,
        paymentToken: data.paymentToken,
        billing: {
          connect: { billingId: data.billingId },
        },
      },
    });
  }

  static update(paymentId: string, data: TUpdatePaymentSchema) {
    return this.db.payment.update({ where: { paymentId }, data });
  }

  static updateByBillingId(billingId: string, data: TUpdatePaymentSchema) {
    return this.db.payment.update({ where: { billingId }, data });
  }
}
