import { MidtransSnap } from "@/core/adapters/midtrans";
import { Logger } from "@/core/lib/logger";
import { PaymentRepository } from "../repositories/PaymentRepository";
import {
  PaymentStatusEnum,
  TPaymentStatusEnum,
  TUpdateFailedPaymentSchema,
  TUpdateSuccessPaymentSchema,
} from "../types";

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

export async function updateSuccessPayment(
  billingId: string,
  data: TUpdateSuccessPaymentSchema
) {
  return await PaymentRepository.updateByBillingId(billingId, {
    ...data,
    paymentStatus: PaymentStatusEnum.Enum.success,
  });
}

export async function updateFailedPayment(
  billingId: string,
  data: TUpdateFailedPaymentSchema
) {
  let status: TPaymentStatusEnum =
    data.paymentStatus === "expired"
      ? PaymentStatusEnum.Enum.expired
      : PaymentStatusEnum.Enum.failed;

  return await PaymentRepository.updateByBillingId(billingId, {
    ...data,
    paymentStatus: status,
  });
}

export function verifyPayment(response: any) {
  MidtransSnap.verifyTransaction(response)
    .then((data) => {
      if (
        data.transaction_status === "capture" &&
        data.fraud_status === "accept"
      ) {
        updateSuccessPayment(data.order_id, {
          paymentMethod: data.payment_type,
          paymentBank: data.bank,
          paymentAmount: parseInt(data.gross_amount),
          paymentDate: new Date(data.settlement_time),
        });
      } else if (data.transaction_status === "settlement") {
        updateSuccessPayment(data.order_id, {
          paymentMethod: data.payment_type,
          paymentBank: data.bank,
          paymentAmount: parseInt(data.gross_amount),
          paymentDate: new Date(data.settlement_time),
        });
      } else if (
        data.transaction_status == "cancel" ||
        data.transaction_status == "deny" ||
        data.transaction_status == "expire"
      ) {
        updateFailedPayment(data.order_id, {
          paymentStatus: data.transaction_status,
          paymentMethod: data.payment_type,
          paymentBank: data.bank,
          paymentAmount: parseInt(data.gross_amount),
          paymentDate: new Date(data.settlement_time),
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
