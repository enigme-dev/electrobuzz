import { NextRequest } from "next/server";
import { buildErr } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import UpdateProfile from "@/users/mutations/updateProfile";
import GetPrivateProfile from "@/users/queries/getPrivateProfile";
import GetPublicProfile from "@/users/queries/getPublicProfile";

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

  const find = await GetPublicProfile(params.id);
  if (!find) {
    return buildErr("ErrNotFound", 404);
  }
  return Response.json({ data: find });
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

  await UpdateProfile(body, params.id);

  return Response.json({ status: "updated successfully" });
}
