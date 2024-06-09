import { MidtransSnap } from "@/core/adapters/midtrans";
import { Logger } from "@/core/lib/logger";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { PaymentStatusEnum, TUpdatePaymentSchema } from "../types";
import { updateBillingPaid } from "@/merchants/services/BillingService";

export async function createPayment(merchantId: string, billingId: string) {
  return await PaymentRepository.create(merchantId, billingId);
}

export async function getPayment(merchantId: string, paymentId: string) {
  return await PaymentRepository.findOne(merchantId, paymentId);
}

export async function updatePayment(
  paymentId: string,
  data: TUpdatePaymentSchema,
) {
  return await PaymentRepository.update(paymentId, data);
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
        }).then((payment) => {
          if (data.transaction_status === PaymentStatusEnum.Enum.success) {
            updateBillingPaid(payment.billingId, true);
          }
        });
      }
    })
    .catch((err) =>
      Logger.error("payment", "midtrans verification error", err),
    );
}
