import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { encrypt } from "@/core/lib/security";
import addMerchantIdentities from "@/merchantIdentities/mutations/addMerchantIdentities";
import getIdentitiesByMerchantId from "@/merchantIdentities/queries/getIdentitiesByMerchantId";
import {
  IdentityStatuses,
  MerchantIdentitiesSchema,
} from "@/merchantIdentities/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  let body,
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

  const merchantId = z.string().cuid().safeParse(token?.merchantId);
  if (!merchantId.success) {
    return buildErr("ErrForbidden", 403, "not registered as merchant");
  }

  const input = MerchantIdentitiesSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    const merchantIdentities = await getIdentitiesByMerchantId(merchantId.data);
    if (merchantIdentities) {
      return buildErr(
        "ErrConflict",
        409,
        "identities has been submitted and being verified"
      );
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  input.data.identityStatus = IdentityStatuses.Enum.pending;
  input.data.merchantId = merchantId.data;

  try {
    const encryptedKtp = await encrypt(input.data.identityKtp);
    input.data.identityKtp = await uploadImg(encryptedKtp, {
      filename: `ktp-${merchantId.data}`,
      bucket: "vault",
    });
    images.push(input.data.identityKtp);
    input.data.identitySkck = await uploadImg(input.data.identitySkck, {
      filename: `skck-${merchantId.data}`,
      bucket: "vault",
    });
    images.push(input.data.identitySkck);
    if (input.data.identityCert) {
      input.data.identityCert = await uploadImg(input.data.identityCert, {
        filename: `sertifikat-${merchantId.data}`,
        bucket: "vault",
      });
      images.push(input.data.identityCert);
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
