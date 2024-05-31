import { PaymentStatusEnum, TPaymentStatusEnum } from "@/payments/types";
import axios from "axios";
import { createHash } from "crypto";
import { z } from "zod";

export const MIDTRANS_SNAP_SB_ENDPOINT =
  "https://app.sandbox.midtrans.com/snap/v1";
export const MIDTRANS_SNAP_PROD_ENDPOINT = "https://app.midtrans.com/snap/v1";

export const MIDTRANS_SB_ENDPOINT = "https://api.sandbox.midtrans.com/v2";
export const MIDTRANS_PROD_ENDPOINT = "https://api.midtrans.com/v2";

export const MTCreateTransactionResponse = z.object({
  status_code: z.number().nullish(),
  token: z.string(),
  redirect_url: z.string().url(),
});

export type TMTCreateTransactionResponse = z.infer<
  typeof MTCreateTransactionResponse
>;

export const MTAfterPaymentResponse = z.object({
  order_id: z.string().cuid(),
  status_code: z.string(),
  transaction_status: z.string(),
  payment_type: z.string(),
  gross_amount: z.string(),
  signature_key: z.string(),
  settlement_time: z.string().optional(),
  fraud_status: z.string().optional(),
  bank: z.string().optional(),
  va_numbers: z
    .object({ va_number: z.string(), bank: z.string() })
    .array()
    .optional(),
  store: z.string().optional(),
  acquirer: z.string().optional(),
});

export type TMTAfterPaymentResponse = z.infer<typeof MTAfterPaymentResponse>;

export const MTVerifPaymentResult = z.object({
  order_id: z.string().cuid(),
  transaction_status: PaymentStatusEnum,
  payment_type: z.string(),
  gross_amount: z.number(),
  settlement_time: z.date().optional(),
  bank: z.string().optional(),
});

export type TMTVerifPaymentResult = z.infer<typeof MTVerifPaymentResult>;

export class MidtransSnap {
  private static serverKey = process.env.MIDTRANS_SERVER_KEY as string;

  private static getSnapEndpoint() {
    if (process.env.NODE_ENV === "production") {
      return MIDTRANS_SNAP_PROD_ENDPOINT;
    }
    return MIDTRANS_SNAP_SB_ENDPOINT;
  }

  private static getEndpoint() {
    if (process.env.NODE_ENV === "production") {
      return MIDTRANS_PROD_ENDPOINT;
    }
    return MIDTRANS_SB_ENDPOINT;
  }

  static async createTransaction(
    billingId: string,
    amount: number
  ): Promise<TMTCreateTransactionResponse> {
    return new Promise((resolve, reject) => {
      axios
        .post<TMTCreateTransactionResponse>(
          this.getSnapEndpoint() + "/transactions",
          {
            transaction_details: {
              order_id: billingId,
              gross_amount: amount,
            },
          },
          { auth: { username: this.serverKey, password: "" } }
        )
        .then((res) => {
          const result = MTCreateTransactionResponse.safeParse(res.data);
          if (!result.success) {
            reject("error response validation");
            return;
          }

          if (
            res.data.status_code &&
            res.data.status_code >= 400 &&
            res.data.status_code != 407
          ) {
            reject(new Error("transaction error"));
            return;
          }
          resolve(result.data);
        })
        .catch((err) => reject(err));
    });
  }

  static async verifyTransaction(
    response: any
  ): Promise<TMTVerifPaymentResult> {
    return new Promise((resolve, reject) => {
      const data = MTAfterPaymentResponse.safeParse(response);
      if (!data.success || !data.data) {
        reject("error response validation");
        return;
      }

      // verify signature key
      const payload =
        data.data.order_id +
        data.data.status_code +
        data.data.gross_amount +
        this.serverKey;
      const hashed = createHash("sha512").update(payload).digest("hex");

      if (hashed != data.data.signature_key) {
        reject("signature key mismatch");
        return;
      }

      // re-verify transaction status from Midtrans API
      axios
        .get(`${this.getEndpoint()}/${data.data.order_id}/status`, {
          auth: { username: this.serverKey, password: "" },
        })
        .then((res) => {
          const verif = MTAfterPaymentResponse.safeParse(res.data);
          if (!verif.success || !verif.data) {
            reject("error response validation");
            return;
          }

          // verify signature key
          const payload =
            verif.data.order_id +
            verif.data.status_code +
            verif.data.gross_amount +
            this.serverKey;
          const hashed = createHash("sha512").update(payload).digest("hex");

          if (hashed != verif.data.signature_key) {
            reject("signature key mismatch");
            return;
          }

          // translate transaction status to payment status enum
          let status: TPaymentStatusEnum = PaymentStatusEnum.Enum.pending,
            bank;
          if (
            verif.data.transaction_status === "capture" &&
            verif.data.fraud_status === "accept"
          ) {
            status = PaymentStatusEnum.Enum.success;
          } else if (verif.data.transaction_status === "settlement") {
            status = PaymentStatusEnum.Enum.success;
          } else if (
            verif.data.transaction_status == "cancel" ||
            verif.data.transaction_status == "deny"
          ) {
            status = PaymentStatusEnum.Enum.failed;
          } else if (verif.data.transaction_status == "expire") {
            status = PaymentStatusEnum.Enum.expired;
          }

          // translate transaction handler/bank to payment bank
          switch (verif.data.payment_type) {
            case "credit_card":
              bank = verif.data.bank;
              break;
            case "qris":
              bank = verif.data.acquirer;
              break;
            case "bank_transfer":
              if (verif.data.va_numbers && verif.data.va_numbers.length > 0) {
                bank = verif.data.va_numbers[0].bank;
              }
              break;
            case "cstore":
              bank = verif.data.store;
              break;
          }

          const result: TMTVerifPaymentResult = {
            order_id: verif.data.order_id,
            transaction_status: status,
            payment_type: verif.data.payment_type,
            gross_amount: parseInt(verif.data.gross_amount),
            bank: bank,
          };
          if (verif.data.settlement_time)
            result.settlement_time = new Date(verif.data.settlement_time);

          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
}
