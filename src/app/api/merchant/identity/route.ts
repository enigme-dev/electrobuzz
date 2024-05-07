import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { encrypt } from "@/core/lib/security";
import { buildRes } from "@/core/lib/utils";
import addMerchantIdentities from "@/merchantIdentities/mutations/addMerchantIdentities";
import getIdentitiesByMerchantId from "@/merchantIdentities/queries/getIdentitiesByMerchantId";
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
    images = [],
    merchant;

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
        return buildErr(
          "ErrForbidden",
          403,
          "user is not registered as merchant"
        );
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    const merchantIdentities = await getIdentitiesByMerchantId(
      merchant.merchantId
    );
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
  input.data.merchantId = merchant.merchantId;

  try {
    const encryptedKtp = await encrypt(input.data.identityKTP);
    input.data.identityKTP = await uploadImg(Buffer.from(encryptedKtp), {
      filename: `ktp-${merchant.merchantId}`,
      bucket: "vault",
    });
    images.push(input.data.identityKTP);
    input.data.identitySKCK = await uploadImg(
      Buffer.from(input.data.identitySKCK),
      {
        filename: `skck-${merchant.merchantId}`,
        bucket: "vault",
      }
    );
    images.push(input.data.identitySKCK);
    if (input.data.identityDocs) {
      input.data.identityDocs = await uploadImg(
        Buffer.from(input.data.identityDocs),
        {
          filename: `docs-${merchant.merchantId}`,
          bucket: "vault",
        }
      );
      images.push(input.data.identityDocs);
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

  return buildRes({ status: "identities submitted successfully" });
}
