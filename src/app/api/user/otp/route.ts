import { ErrorCode, buildErr } from "@/core/lib/errors";
import {
  checkPhoneVerification,
  requestPhoneVerification,
} from "@/users/services/UserService";
import { VerifyOTPSchema, VerifyStatuses } from "@/users/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { buildRes } from "@/core/lib/utils";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest) {
  let result;
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    result = await requestPhoneVerification(userId.data);

    if (result.error === "ErrTooManyRequest") {
      return buildErr("ErrTooManyRequest", 429, {
        message: "OTP can be requested every 2 minutes",
        expiredAt: result.expiredAt?.toISOString(),
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case ErrorCode.ErrNotFound:
          return buildErr("ErrNotFound", 404, "user does not exist");
        case ErrorCode.ErrOTPNotRegistered:
          return buildErr("ErrOTPNotRegistered", 409, e.message);
        case ErrorCode.ErrOTPVerified:
          return buildErr("ErrOTPVerified", 409, e.message);
      }
    }

    Logger.error("user", "request otp error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({
    status: "OTP sent successfully",
    data: { verifId: result.data, expiredAt: result.expiredAt },
  });
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
    const response = await checkPhoneVerification(userId.data, data.data);
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
  } catch (e) {
    Logger.error("user", "check otp error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "phone verified successfully" });
}
