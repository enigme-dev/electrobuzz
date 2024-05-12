import { SendMessage } from "@/core/adapters/watzap";
import { VerificationRepository } from "@/users/repositories/VerificationRepository";
import dayjs from "dayjs";
import { generateOTP } from "../lib/verification";
import { VerifyStatuses } from "../types";
import { hash } from "@/core/lib/security";

export async function checkOTP(verifId: string, code: string) {
  let verification;

  try {
    verification = await VerificationRepository.findOne(verifId);
  } catch (e) {
    return VerifyStatuses.Enum.error;
  }

  if (!verification) {
    return VerifyStatuses.Enum.not_found;
  }

  if (dayjs().diff(verification.createdAt, "minute") >= 2) {
    return VerifyStatuses.Enum.expired;
  }

  const hashedCode = hash(code);
  if (verification.code != hashedCode) {
    return VerifyStatuses.Enum.incorrect;
  }

  return VerifyStatuses.Enum.correct;
}

export async function sendOTP(phoneNumber: string) {
  let verification, expiredAt;
  const verifId = hash(phoneNumber);
  const code = generateOTP();

  try {
    verification = await VerificationRepository.findOne(verifId);
    expiredAt = dayjs(verification?.createdAt).add(2, "minute");
    if (verification && dayjs().diff(verification.createdAt, "minute") < 2) {
      return {
        error: "ErrTooManyRequest",
        expiredAt,
      };
    }
  } catch (e) {}

  const hashedCode = hash(code);
  verification = await VerificationRepository.upsert(verifId, hashedCode);
  expiredAt = dayjs(verification?.createdAt).add(2, "minute");
  await SendMessage(
    phoneNumber,
    `Kode verifikasi akun Electrobuzz anda adalah ${code}`
  );

  return { data: verifId, expiredAt };
}
