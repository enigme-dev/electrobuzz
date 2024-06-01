import { BaseRepository } from "@/core/repositories/BaseRepository";
import { PaymentStatusEnum, TUpdatePaymentSchema } from "../types";
import { MidtransSnap } from "@/core/adapters/midtrans";
import { Prisma } from "@prisma/client";
import { ErrorCode } from "@/core/lib/errors";

export class PaymentRepository extends BaseRepository {
  static create(merchantId: string, billingId: string) {
    return this.db.$transaction(
      async (tx) => {
        const billing = await tx.billing.findUniqueOrThrow({
          where: { billingId, merchantId, billingPaid: false },
          select: {
            billingAmount: true,
            payment: {
              select: {
                paymentStatus: true,
              },
            },
          },
        });

        // check if payment request exceed limit
        const paymentLen = billing.payment.length;
        if (paymentLen >= 3) {
          throw new Error(ErrorCode.ErrTooManyRequest);
        }

        // check if last payment is pending / success
        if (
          billing.payment[paymentLen - 1].paymentStatus === "pending" ||
          billing.payment[paymentLen - 1].paymentStatus === "success"
        ) {
          throw new Error(ErrorCode.ErrConflict);
        }

        const payment = await tx.payment.create({
          data: {
            paymentStatus: PaymentStatusEnum.Enum.pending,
            billing: {
              connect: { billingId },
            },
          },
        });

        const transaction = await MidtransSnap.createTransaction(
          payment.paymentId,
          billing.billingAmount
        );

        return transaction;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }

  static update(paymentId: string, data: TUpdatePaymentSchema) {
    return this.db.payment.update({ where: { paymentId }, data });
  }
}
