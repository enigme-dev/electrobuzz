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
                paymentUrl: true,
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
        if (paymentLen > 0) {
          if (billing.payment[paymentLen - 1].paymentStatus === "pending") {
            return { redirect_url: billing.payment[paymentLen - 1].paymentUrl };
          } else if (
            billing.payment[paymentLen - 1].paymentStatus === "success"
          ) {
            throw new Error(ErrorCode.ErrConflict);
          }
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
          billing.billingAmount,
        );

        await tx.payment.update({
          where: { paymentId: payment.paymentId },
          data: { paymentUrl: transaction.redirect_url },
        });

        return transaction;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  static findOne(merchantId: string, paymentId: string) {
    return this.db.payment.findUniqueOrThrow({
      where: {
        paymentId,
        billing: {
          merchantId,
        },
      },
      select: {
        paymentId: true,
        paymentStatus: true,
        paymentAmount: true,
        paymentBank: true,
        paymentMethod: true,
        paymentDate: true,
        billingId: true,
      },
    });
  }

  static update(paymentId: string, data: TUpdatePaymentSchema) {
    return this.db.payment.update({ where: { paymentId }, data });
  }
}
