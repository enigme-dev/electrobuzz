import { MidtransSnap } from "@/core/adapters/midtrans";
import { Logger } from "@/core/lib/logger";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { PaymentStatusEnum, TUpdatePaymentSchema } from "../types";

export async function createPayment(billingId: string, amount: number) {
  try {
    const transaction = await MidtransSnap.createTransaction(billingId, amount);

    await PaymentRepository.create({
      billingId,
      paymentToken: transaction.token,
      paymentStatus: PaymentStatusEnum.Enum.pending,
    });

    return { token: transaction.token, redirect_url: transaction.redirect_url };
  } catch (e) {
    Logger.error("payment", "create payment error", e);
    throw e;
  }
}

export async function updatePayment(
  billingId: string,
  data: TUpdatePaymentSchema
) {
  return await PaymentRepository.updateByBillingId(billingId, data);
}

export function verifyPayment(response: any) {
  MidtransSnap.verifyTransaction(response)
    .then((data) => {
      if (data.transaction_status != PaymentStatusEnum.Enum.pending) {
        updatePayment(data.order_id, {
          paymentStatus: data.transaction_status,
          paymentAmount: data.gross_amount,
          paymentMethod: data.payment_type,
          paymentBank: data.bank,
          paymentDate: data.settlement_time,
        });
      }
    })
    .catch((err) =>
      Logger.error("payment", "midtrans verification error", err)
    );
}
