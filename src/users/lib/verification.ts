import {SendMessage} from "@/core/adapters/watzap";
import {addVerification, getVerification} from "@/users/services/VerificationService";
import dayjs from "dayjs";
import {VerifyStatuses} from "../types";
import {createHash} from "crypto";

export function generateOTP(length = 6) {
  let digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * 10)];
  }

  return result;
}

export async function sendOTP(phoneNumber: string) {
  let verification, expiredAt;
  const hashed = createHash("sha1").update(phoneNumber).digest("hex");
  const code = generateOTP();

  try {
    verification = await getVerification(hashed);
    expiredAt = dayjs(verification?.createdAt).add(2, "minute")
    if (verification && dayjs().diff(verification.createdAt, "minute") < 2) {
      return {
        error: "ErrTooManyRequest",
        expiredAt,
      };
    }

    verification = await addVerification(hashed, code);
    expiredAt = dayjs(verification?.createdAt).add(2, "minute")
    await SendMessage(
      phoneNumber,
      `Kode verifikasi akun Electrobuzz anda adalah ${code}`
    );
  } catch (e) {
    return {error: "ErrUnknown"};
  }

  return {data: hashed, expiredAt};
}

export async function checkOTP(verifId: string, code: string) {
  let verification;

  try {
    verification = await getVerification(verifId);
  } catch (e) {
    return VerifyStatuses.Enum.error;
  }

  if (!verification) {
    return VerifyStatuses.Enum.not_found;
  }

  if (dayjs().diff(verification.createdAt, "minute") >= 2) {
    return VerifyStatuses.Enum.expired;
  }

  if (verification.code != code) {
    return VerifyStatuses.Enum.incorrect;
  }

  return VerifyStatuses.Enum.correct;
}
