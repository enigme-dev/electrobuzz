import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { addMerchant } from "@/merchants/mutations/addMerchant";
import { MerchantModel } from "@/merchants/types";
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const input = MerchantModel.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    const user = await getPrivateProfile(userId.data);
    if (!user?.phoneVerified) {
      return buildErr("ErrForbidden", 403, "phone has not been verified");
    }
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  try {
    const imageUrl = await uploadImg(input.data.merchantPhotoUrl, 512);
    input.data.merchantPhotoUrl = imageUrl;

    await addMerchant(userId.data, input.data);
  } catch (e) {
    await deleteImg(
      input.data.merchantPhotoUrl.replace(
        process.env.ASSETS_URL as string,
        ""
      ) + "/"
    );
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2014") {
        return buildErr(
          "ErrConflict",
          409,
          "user already registered as a merchant"
        );
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "merchant registered successfully" });
}
