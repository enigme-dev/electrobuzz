import { SendMessage } from "@/core/adapters/watzap";
import addVerification from "../mutations/addVerification";
import getVerification from "../queries/checkVerification";
import dayjs from "dayjs";
import { VerifyStatuses } from "../types";
import { createHash } from "crypto";

export function generateOTP(length = 6) {
  let digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * 10)];
  }

  return result;
}

export async function sendOTP(phoneNumber: string) {
  const hashed = createHash("sha1").update(phoneNumber).digest("hex");
  const code = generateOTP();

  try {
    const verification = await getVerification(hashed);
    if (verification && dayjs().diff(verification.createdAt, "minute") < 5) {
      return { error: "ErrTooManyRequest" };
    }

    await addVerification(hashed, code);
    await SendMessage(
      phoneNumber,
      `Kode verifikasi akun Electrobuzz anda adalah ${code}`
    );
  } catch (e) {
    return { error: "ErrUnknown" };
  }

  return { data: hashed };
}

export async function checkOTP(verifId: string, code: string) {
  let verification;

  try {
    verification = await getVerification(verifId);
  } catch (e) {
    return VerifyStatuses.Enum.error;
  }

  if (!verification) {
    return VerifyStatuses.Enum.error;
  }

  if (dayjs().diff(verification.createdAt, "minute") >= 5) {
    return VerifyStatuses.Enum.expired;
  }

  if (verification.code != code) {
    return VerifyStatuses.Enum.incorrect;
  }

  return VerifyStatuses.Enum.correct;
}
