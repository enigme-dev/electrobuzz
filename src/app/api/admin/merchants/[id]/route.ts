import {buildErr} from "@/core/lib/errors";
import {deleteImg, getImg} from "@/core/lib/image";
import {decrypt} from "@/core/lib/security";
import editMerchantIdentity from "@/merchantIdentities/mutations/editMerchantIdentity";
import getIdentitiesByMerchantId from "@/merchantIdentities/queries/getIdentitiesByMerchantId";
import addMerchantIndex from "@/merchants/mutations/addMerchantIndex";
import {getMerchant} from "@/merchants/services/MerchantService";
import {NextRequest} from "next/server";
import {z} from "zod";
import {IdParam} from "@/core/lib/utils";
import {EditMerchantIdentitySchema, IdentityStatuses} from "@/merchants/types";

export async function GET(req: NextRequest, {params}: IdParam) {
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
    ktp = await getImg(result.identityKTP as string, "vault");
    skck = await getImg(result.identitySKCK as string, "vault");
    if (result?.identityDocs) {
      cert = await getImg(result.identityDocs, "vault");
    }

    result.identityKTP = await decrypt(ktp);
    result.identitySKCK = await decrypt(skck);
    if (cert) {
      result.identityDocs = await decrypt(cert);
    }
  } catch (e) {
    console.error(e);
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({data: result});
}

export async function PATCH(req: NextRequest, {params}: IdParam) {
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
      await deleteImg(identity?.identityKTP as string, "vault");
      await deleteImg(identity?.identitySKCK as string, "vault");
      if (identity?.identityDocs) {
        await deleteImg(identity.identityDocs, "vault");
      }
    }

    if (input.data.identityStatus === IdentityStatuses.Enum.verified) {
      const merchant = await getMerchant(merchantId.data);
      await addMerchantIndex(merchant);
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({status: "merchant updated successfully"});
}
