import {buildErr, ErrorCode} from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { removeImagePrefix } from "@/merchants/lib/utils";
import { addMerchant } from "@/merchants/mutations/addMerchant";
import { RegisterMerchantSchema } from "@/merchants/types";
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { buildRes } from "@/core/lib/utils";
import { IdentityStatuses } from "@/merchantIdentities/types";
import { encrypt } from "@/core/lib/security";

export async function POST(req: NextRequest) {
  let body,
    images = [];
  const token = await getToken({ req });

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
    input.data.merchantPhotoUrl = await uploadImg(input.data.merchantPhotoUrl);
    input.data.merchantAvailable = true;
    input.data.merchantIdentity.identityStatus = IdentityStatuses.Enum.pending;

    const encryptedKtp = await encrypt(input.data.merchantIdentity.identityKTP);
    input.data.merchantIdentity.identityKTP = await uploadImg(
      encryptedKtp,
      {
        filename: `ktp-${userId.data}`,
        bucket: "vault",
      }
    );
    images.push(input.data.merchantIdentity.identityKTP);

    const encryptedSkck = await encrypt(
      input.data.merchantIdentity.identitySKCK
    );
    input.data.merchantIdentity.identitySKCK = await uploadImg(
      encryptedSkck,
      {
        filename: `skck-${userId.data}`,
        bucket: "vault",
      }
    );
    images.push(input.data.merchantIdentity.identitySKCK);

    if (input.data.merchantIdentity.identityDocs) {
      input.data.merchantIdentity.identityDocs = await uploadImg(
        input.data.merchantIdentity.identityDocs,
        {
          filename: `docs-${userId.data}`,
          bucket: "vault",
        }
      );
      images.push(input.data.merchantIdentity.identityDocs);
    }

    await addMerchant(userId.data, input.data);
  } catch (e) {
    await deleteImg(removeImagePrefix(input.data.merchantPhotoUrl));

    images.map(async (image) => {
      await deleteImg(image);
    });

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

  return buildRes({ status: "merchant registered successfully" });
}
