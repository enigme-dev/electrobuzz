import { buildErr } from "@/core/lib/errors";
import { deleteImg } from "@/core/lib/image";
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
