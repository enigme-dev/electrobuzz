import { NextRequest } from "next/server";
import { buildErr, ErrorCode } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { updateProfile } from "@/users/services/UserService";
import {
  getPrivateProfile,
  getPublicProfile,
} from "@/users/services/UserService";
import { Prisma } from "@prisma/client";
import { UpdateProfileSchema } from "@/users/types";
import { buildRes, IdParam } from "@/core/lib/utils";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest, { params }: IdParam) {
  let profile;
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (userId.success && userId.data === params.id) {
    try {
      profile = await getPrivateProfile(userId.data);
    } catch (e) {
      Logger.error("profile", "get private profile error", e);
      return buildErr("ErrUnknown", 500);
    }
    return buildRes({ data: profile });
  }

  try {
    profile = await getPublicProfile(params.id);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "user not found");
      }
    }
    Logger.error("profile", "get public profile error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: profile });
}

export async function PATCH(req: NextRequest, { params }: IdParam) {
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
    return buildErr("ErrConflict", 409, "user ids not matching");
  }

  const input = UpdateProfileSchema.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    await updateProfile(params.id, input.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return buildErr("ErrConflict", 409, "phone number already registered");
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

    Logger.error("profile", "update profile error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "updated successfully" });
}
