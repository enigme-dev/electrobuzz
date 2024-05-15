import { SendMessage } from "@/core/adapters/watzap";
import { VerificationRepository } from "@/users/repositories/VerificationRepository";
import dayjs from "dayjs";
import { generateOTP } from "../lib/verification";
import { VerifyStatuses } from "../types";
import { hash } from "@/core/lib/security";
import { Prisma } from "@prisma/client";

export async function checkOTP(verifId: string, code: string) {
  let verification;

  try {
    verification = await VerificationRepository.findOne(verifId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return VerifyStatuses.Enum.not_found;
      }
    }

    return VerifyStatuses.Enum.error;
  }

  if (!verification) {
    return VerifyStatuses.Enum.not_found;
  }

  if (dayjs().diff(verification.createdAt, "minute") >= 2) {
    try {
      await VerificationRepository.delete(verifId);
    } catch (e) {
      return VerifyStatuses.Enum.error;
    }

    return VerifyStatuses.Enum.expired;
  }

  const hashedCode = hash(code);
  if (verification.code != hashedCode) {
    return VerifyStatuses.Enum.incorrect;
  }

  try {
    await VerificationRepository.delete(verifId);
  } catch (e) {
    return VerifyStatuses.Enum.error;
  }

  return VerifyStatuses.Enum.correct;
}

export async function deleteExpiredOTP() {
  const now = new Date();
  const epoch = new Date(0);

  const startDate = epoch;
  const endDate = dayjs(now).subtract(1, "hours").toDate();

  return VerificationRepository.deleteMany(startDate, endDate);
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
