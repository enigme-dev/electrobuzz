import {buildErr} from "@/core/lib/errors";
import {checkOTP, sendOTP} from "@/users/lib/verification";
import {getPrivateProfile, updatePhoneVerification} from "@/users/services/UserService";
import {VerifyOTPSchema, VerifyStatuses} from "@/users/types";
import {getToken} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {z} from "zod";
import {buildRes} from "@/core/lib/utils";

export async function GET(req: NextRequest) {
  let result;
  const token = await getToken({req});

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    const user = await getPrivateProfile(userId.data);
    if (!user?.phone) {
      return buildErr("ErrOTPNotRegistered", 409, "phone is not registered");
    }

    if (user?.phoneVerified) {
      return buildErr("ErrOTPVerified", 409, "phone has been verified already");
    }

    result = await sendOTP(user?.phone);
    if (result.error === "ErrTooManyRequest") {
      return buildErr(
        "ErrTooManyRequest",
        429,
        {message: "OTP can be requested every 2 minutes", expiredAt: result.expiredAt?.toISOString()}
      );
    } else if (result.error === "ErrUnknown") {
      return buildErr("ErrUnknown", 500);
    }
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({
    status: "OTP sent successfully",
    data: {verifId: result.data, expiredAt: result.expiredAt},
  });
}

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const token = await getToken({req});

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
      return buildErr("ErrOTPNotRegistered", 409, "phone is not registered");
    }

    if (user?.phoneVerified) {
      return buildErr("ErrOTPVerified", 409, "phone has been verified already");
    }

    const response = await checkOTP(data.data.verifId, data.data.code);
    switch (response) {
      case VerifyStatuses.Enum.incorrect:
        return buildErr("ErrOTPIncorrect", 400, "incorrect OTP code");
      case VerifyStatuses.Enum.expired:
        return buildErr("ErrOTPExpired", 400, "expired OTP code");
      case VerifyStatuses.Enum.not_found:
        return buildErr("ErrOTPNotFound", 404, "verifId does not exist");
      case VerifyStatuses.Enum.error:
        return buildErr("ErrOTPUnknown", 500);
    }

    await updatePhoneVerification(userId.data, true);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({status: "phone verified successfully"});
}
