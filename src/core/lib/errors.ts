import { z } from "zod";

interface ErrorResponse {
  status: ErrorCodeStrings;
  data?: any;
}

export enum ErrorCode {
  // general
  ErrNotFound = "data not found",
  ErrUnauthorized = "sign in to continue",
  ErrUnknown = "unknown error occurred",
  ErrValidation = "error in parsing input data",
  ErrForbidden = "request forbidden",
  ErrConflict = "request conflict",
  ErrTooManyRequest = "too many request",

  // otp
  ErrOTPIncorrect = "incorrect OTP code",
  ErrOTPNotFound = "verifId does not exist",
  ErrOTPUnknown = "unknown error occured",
  ErrOTPExpired = "expired OTP code",
  ErrOTPVerified = "phone has been verified already",
  ErrOTPNotRegistered = "phone is not registered",
}

export type ErrorCodeStrings = keyof typeof ErrorCode;

export function buildErr(
  code: ErrorCodeStrings,
  status: number,
  message?: string | z.ZodError
) {
  const err: ErrorResponse = { status: code, data: ErrorCode[code] };
  if (message) {
    if (typeof message === "string") {
      err.data = message;
    } else {
      err.data = message.flatten().fieldErrors;
    }
  }

  return Response.json(err, { status: status });
}
