import { NextRequest } from "next/server";
import { buildErr } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import updateProfile from "@/users/mutations/updateProfile";
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import getPublicProfile from "@/users/queries/getPublicProfile";
import { Prisma } from "@prisma/client";
import { UpdateProfileSchema } from "@/users/types";
import { deleteImg, uploadImg } from "@/core/lib/image";

interface IdParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: IdParams) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (userId.success && userId.data == params.id) {
    const find = await getPrivateProfile(userId.data);
    return Response.json({ data: find });
  }

  let result;
  try {
    result = await getPublicProfile(params.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404);
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
      "ErrUnauthorized",
      403,
      "not allowed to update other user's profile"
    );
  }

  const input = UpdateProfileSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  let imageUrl = input.data.image;
  if (!input.data.image.startsWith(process.env.ASSETS_URL as string)) {
    try {
      const user = await getPublicProfile(userId.data);
      if (user?.image?.startsWith(process.env.ASSETS_URL as string)) {
        await deleteImg(user?.image);
      }

      imageUrl = await uploadImg(input.data.image);
    } catch (e) {
      return buildErr("ErrUnknown", 500);
    }
  }

  input.data.image = imageUrl;

  try {
    await updateProfile(input.data, params.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return buildErr("ErrConflict", 409, "phone number already registered");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "updated successfully" });
}
