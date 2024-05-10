import {z} from "zod";

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
  ErrOTPUnknown = "unknown error occurred",
  ErrOTPExpired = "expired OTP code",
  ErrOTPVerified = "phone has been verified already",
  ErrOTPNotRegistered = "phone is not registered",

  // image
  ErrImgInvalidImageType = "invalid image type",
  ErrImgInvalidDataURL = "invalid data URL format",
  ErrImgFailedUpload = "failed to upload image",
}

export type ErrorCodeStrings = keyof typeof ErrorCode;

export function buildErr(
  code: ErrorCodeStrings,
  status: number,
  message?: any
) {
  const err: ErrorResponse = {status: code, data: ErrorCode[code]};
  if (message) {
    if (message instanceof z.ZodError) {
      err.data = message.flatten().fieldErrors;
    } else {
      err.data = message;
    }
  }

  return Response.json(err, {status: status});
}
