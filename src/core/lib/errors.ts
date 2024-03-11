import { z } from "zod";

interface ErrorResponse {
  code: ErrorCodeStrings;
  message?: any;
}

export enum ErrorCode {
  // general
  ErrNotFound = "data not found",
  ErrUnauthorized = "sign in to continue",
  ErrUnknown = "unknown error occurred",
  ErrValidation = "error in parsing input data",
  ErrForbidden = "request forbidden",
}

export type ErrorCodeStrings = keyof typeof ErrorCode;

export function buildErr(
  code: ErrorCodeStrings,
  status: number,
  message?: string | z.ZodError
) {
  const err: ErrorResponse = { code: code, message: ErrorCode[code] };
  if (message) {
    if (typeof message === "string") {
      err.message = message;
    } else {
      err.message = message.flatten().fieldErrors;
    }
  }

  return Response.json({ error: err }, { status: status });
}
