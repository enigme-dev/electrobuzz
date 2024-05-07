import { NextRequest } from "next/server";
import { buildErr } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import updateProfile from "@/users/mutations/updateProfile";
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import getPublicProfile from "@/users/queries/getPublicProfile";
import { Prisma } from "@prisma/client";
import { UpdateProfileSchema } from "@/users/types";
import { compressImg, deleteImg, uploadImg } from "@/core/lib/image";
import { removeImagePrefix } from "@/merchants/lib/utils";

interface IdParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: IdParams) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (userId.success && userId.data === params.id) {
    let response;
    try {
      const find = await getPrivateProfile(userId.data);

      response = {
        id: find?.id,
        name: find?.name,
        email: find?.email,
        phone: find?.phone,
        phoneVerified: find?.phoneVerified,
        image: find?.image,
      };
    } catch (e) {
      return buildErr("ErrUnknown", 500);
    }
    return Response.json({ data: response });
  }

  let result;
  try {
    result = await getPublicProfile(params.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "user not found");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ data: result });
}

export async function PATCH(req: NextRequest, { params }: IdParams) {
  let body;

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  if (userId.data !== params.id) {
    return buildErr(
      "ErrForbidden",
      403,
      "not allowed to update other user's profile"
    );
  }

  const input = UpdateProfileSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  let imageUrl;
  try {
    if (input.data.image?.startsWith("data:image")) {
      const user = await getPrivateProfile(userId.data);
      if (user?.image?.startsWith(process.env.ASSETS_URL as string)) {
        await deleteImg(user?.image);
      }

      const compressed = await compressImg(input.data.image);
      imageUrl = await uploadImg(compressed);
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  input.data.image = imageUrl;

  try {
    await updateProfile(input.data, params.id);
  } catch (e) {
    if (imageUrl) {
      deleteImg(removeImagePrefix(imageUrl));
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return buildErr("ErrConflict", 409, "phone number already registered");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "updated successfully" });
}
