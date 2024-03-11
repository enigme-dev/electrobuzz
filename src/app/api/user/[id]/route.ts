import { NextRequest } from "next/server";
import { buildErr } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import updateProfile from "@/users/mutations/updateProfile";
import GetPrivateProfile from "@/users/queries/getPrivateProfile";
import GetPublicProfile from "@/users/queries/getPublicProfile";
import { Prisma } from "@prisma/client";

interface IdParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: IdParams) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (userId.success && userId.data == params.id) {
    const find = await GetPrivateProfile(userId.data);
    return Response.json({ data: find });
  }

  let result;
  try {
    result = await GetPublicProfile(params.id);
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

  if (userId.data != params.id) {
    return buildErr(
      "ErrUnauthorized",
      403,
      "not allowed to update other user's profile"
    );
  }

  try {
    await updateProfile(body, params.id);
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
