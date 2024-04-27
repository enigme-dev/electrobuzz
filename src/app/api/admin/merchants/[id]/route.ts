import { buildErr } from "@/core/lib/errors";
import { deleteImg, getImg } from "@/core/lib/image";
import { decrypt } from "@/core/lib/security";
import editMerchantIdentity from "@/merchantIdentities/mutations/editMerchantIdentity";
import getIdentitiesByMerchantId from "@/merchantIdentities/queries/getIdentitiesByMerchantId";
import {
  EditMerchantIdentitySchema,
  IdentityStatuses,
} from "@/merchantIdentities/types";
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

  let result, ktp, skck, cert;
  try {
    result = await getIdentitiesByMerchantId(merchantId.data);
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  if (!result) {
    return buildErr("ErrNotFound", 404);
  }

  try {
    ktp = await getImg(result.identityKtp as string, "vault");
    skck = await getImg(result.identitySkck as string, "vault");
    if (result?.identityCert) {
      cert = await getImg(result.identityCert, "vault");
    }

    result.identityKtp = await decrypt(ktp);
    result.identitySkck = await decrypt(skck);
    if (cert) {
      result.identityCert = await decrypt(cert);
    }
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ data: result });
}

export async function PATCH(req: NextRequest, { params }: IdParams) {
  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const input = EditMerchantIdentitySchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await editMerchantIdentity(merchantId.data, input.data.identityStatus);
    if (input.data.identityStatus === IdentityStatuses.Enum.rejected) {
      const identity = await getIdentitiesByMerchantId(merchantId.data);
      await deleteImg(identity?.identityKtp as string, "vault");
      await deleteImg(identity?.identitySkck as string, "vault");
      if (identity?.identityCert) {
        await deleteImg(identity.identityCert, "vault");
      }
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "merchant updated successfully" });
}
