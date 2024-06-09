import { NextRequest } from "next/server";
import { buildRes, IdParam } from "@/core/lib/utils";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { getPayment } from "@/payments/services/PaymentService";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest, { params }: IdParam) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const paymentId = z.string().cuid().safeParse(params.id);
  if (!paymentId.success) {
    return buildErr("ErrValidation", 400, "invalid payment id");
  }

  try {
    const payment = await getPayment(userId.data, paymentId.data);
    return buildRes({ data: payment });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "payment does not exist");
      }
    }

    Logger.error("payment", "get payment detail error", e);
    return buildErr("ErrUnknown", 500);
  }
}
