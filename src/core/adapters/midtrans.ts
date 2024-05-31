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
  fraud_status: z.string().optional(),
  payment_type: z.string(),
  bank: z.string().optional(),
  gross_amount: z.string(),
  settlement_time: z.string().datetime(),
  signature_key: z.string(),
});

export type TMTAfterPaymentResponse = z.infer<typeof MTAfterPaymentResponse>;

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
          { order_id: billingId, gross_amount: amount },
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
  ): Promise<TMTAfterPaymentResponse> {
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
      const hashed = createHash("sha512").update(payload).digest("base64");

      if (hashed != data.data.signature_key) {
        reject("signature key mismatch");
        return;
      }

      // get transaction status from Midtrans API
      axios
        .get(this.getEndpoint() + data.data.order_id + "/status", {
          auth: { username: this.serverKey, password: "" },
        })
        .then((res) => {
          const result = MTAfterPaymentResponse.safeParse(res);
          if (!result.success || !result.data) {
            reject("error response validation");
            return;
          }

          if (result.data.status_code != "200") {
            reject("transaction error");
            return;
          }

          // verify signature key
          const payload =
            result.data.order_id +
            result.data.status_code +
            result.data.gross_amount +
            this.serverKey;
          const hashed = createHash("sha512").update(payload).digest("base64");

          if (hashed != result.data.signature_key) {
            reject("signature key mismatch");
            return;
          }

          resolve(result.data);
        })
        .catch((err) => reject(err));
    });
  }
}
