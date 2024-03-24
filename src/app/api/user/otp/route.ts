import { buildErr } from "@/core/lib/errors";
import { checkOTP, sendOTP } from "@/users/lib/verification";
import updatePhoneVerification from "@/users/mutations/updatePhoneVerification";
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import { VerifyOTPSchema } from "@/users/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    const user = await getPrivateProfile(userId.data);
    if (!user?.phone) {
      return buildErr("ErrConflict", 409, "phone is not registered");
    }

    if (user?.phoneVerified) {
      return buildErr("ErrConflict", 409, "phone has been verified already");
    }

    await sendOTP(user?.phone);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "OTP sent successfully" });
}

export async function POST(req: NextRequest) {
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

  const data = VerifyOTPSchema.safeParse(body);
  if (!data.success) {
    return buildErr("ErrValidation", 400, data.error);
  }

  try {
    const user = await getPrivateProfile(userId.data);
    if (!user?.phone) {
      return buildErr("ErrConflict", 409, "phone is not registered");
    }

    if (user?.phoneVerified) {
      return buildErr("ErrConflict", 409, "phone has been verified already");
    }

    const response = await checkOTP(user?.phone, data.data.code);
    if (response.status !== "approved") {
      return buildErr("ErrValidation", 400, "code is incorrect");
    }

    await updatePhoneVerification(userId.data, true);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "phone verified successfully" });
}
