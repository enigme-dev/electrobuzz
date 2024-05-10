import {buildErr} from "@/core/lib/errors";
import {buildRes, IdParam} from "@/core/lib/utils";
import {getMerchant} from "@/merchants/services/MerchantService";
import {Prisma} from "@prisma/client";
import {NextRequest} from "next/server";
import {z} from "zod";

export async function GET(req: NextRequest, {params}: IdParam) {
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  try {
    const merchant = await getMerchant(merchantId.data);
    return buildRes({data: merchant});
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }
}
