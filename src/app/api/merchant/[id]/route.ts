import { buildErr } from "@/core/lib/errors";
import getMerchant from "@/merchants/queries/getMerchant";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

interface IdParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: IdParams) {
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    const merchant = await getMerchant(merchantId.data);
    return Response.json({ data: merchant });
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }
}
