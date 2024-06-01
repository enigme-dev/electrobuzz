import { ErrorCode, buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { IdParam, buildRes } from "@/core/lib/utils";
import { getMerchantBilling } from "@/merchants/services/BillingService";
import { createPayment } from "@/payments/services/PaymentService";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: IdParam) {
  let billing;
  const token = await getToken({ req });

  const billingId = z.string().cuid().safeParse(params.id);
  if (!billingId.success) {
    return buildErr("ErrValidation", 400, "invalid booking id");
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    billing = await getMerchantBilling(userId.data, billingId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "billing does not exist");
      }
    }

    Logger.error("billing", "get billing detail error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: billing });
}

export async function POST(req: NextRequest, { params }: IdParam) {
  let transaction;
  const token = await getToken({ req });

  const billingId = z.string().cuid().safeParse(params.id);
  if (!billingId.success) {
    return buildErr("ErrValidation", 400, "invalid booking id");
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    transaction = await createPayment(userId.data, billingId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "billing does not exist");
      }
    }

    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrTooManyRequest) {
        return buildErr(
          "ErrTooManyRequest",
          429,
          "cannot create more than 3 payment request. please contact administrator"
        );
      } else if (e.message === ErrorCode.ErrConflict) {
        return buildErr(
          "ErrConflict",
          409,
          "last payment request is either pending / success"
        );
      }
    }

    Logger.error("billing", "create billing payment error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: transaction });
}
