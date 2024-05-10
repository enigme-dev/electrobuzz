import {buildErr, ErrorCode} from "@/core/lib/errors";
import {registerMerchant} from "@/merchants/services/MerchantService";
import {RegisterMerchantSchema} from "@/merchants/types";
import {getPrivateProfile} from "@/users/services/UserService";
import {Prisma} from "@prisma/client";
import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {z} from "zod";
import {buildRes} from "@/core/lib/utils";

export async function POST(req: NextRequest) {
  let body;
  const token = await getToken({req});

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const input = RegisterMerchantSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    const user = await getPrivateProfile(userId.data);
    if (!user?.phoneVerified) {
      return buildErr("ErrForbidden", 403, "phone has not been verified");
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  try {
    await registerMerchant(userId.data, input.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2014") {
        return buildErr(
          "ErrConflict",
          409,
          "user already registered as a merchant"
        );
      }
    }

    if (e instanceof Error) {
      if (e.message === ErrorCode.ErrImgInvalidDataURL) {
        return buildErr("ErrImgInvalidDataURL", 400);
      }

      if (e.message === ErrorCode.ErrImgInvalidImageType) {
        return buildErr("ErrImgInvalidImageType", 400);
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({status: "merchant registered successfully"});
}
