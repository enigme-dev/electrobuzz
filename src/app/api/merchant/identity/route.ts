import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import addMerchantIdentities from "@/merchantIdentities/mutations/addMerchantIdentities";
import {
  IdentityStatuses,
  MerchantIdentitiesSchema,
} from "@/merchantIdentities/types";
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  let body,
    merchant,
    images = [];

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const input = MerchantIdentitiesSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    merchant = await getMerchantByUserId(userId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  input.data.identityStatus = IdentityStatuses.Enum.pending;
  input.data.merchantId = merchant.merchantId;

  try {
    images.push(await uploadImg(input.data.identityKtp));
    images.push(await uploadImg(input.data.identitySkck));
    if (input.data.identityCert) {
      images.push(await uploadImg(input.data.identityCert));
    }
  } catch (e) {
    images.map(async (image) => {
      await deleteImg(image);
    });
    return buildErr("ErrUnknown", 500);
  }

  try {
    await addMerchantIdentities(input.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "identities submitted successfully" });
}
