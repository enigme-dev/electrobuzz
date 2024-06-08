import { SendMessage } from "@/core/adapters/watzap";
import dayjs from "dayjs";
import { generateOTP } from "../lib/verification";
import { VerifyStatuses } from "../types";
import { hash } from "@/core/lib/security";
import { RedisClient } from "@/core/adapters/redis";

export async function checkOTP(verifId: string, code: string) {
  let verification;
  const key = `code/${verifId}`;

  verification = await RedisClient.get(key);

  if (!verification) {
    return VerifyStatuses.Enum.not_found;
  }

  const hashedCode = hash(code);
  if (verification != hashedCode) {
    return VerifyStatuses.Enum.incorrect;
  }

  RedisClient.del(key);

  return VerifyStatuses.Enum.correct;
}

export async function sendOTP(phoneNumber: string) {
  let ttl, expiredAt;
  const verifId = hash(phoneNumber);
  const key = `code/${verifId}`;
  const code = generateOTP();

  ttl = await RedisClient.ttl(key);
  if (ttl && ttl > 0) {
    return {
      error: "ErrTooManyRequest",
      expiredAt: dayjs().add(ttl, "s").toDate(),
    };
  }

  const hashedCode = hash(code);
  RedisClient.set(key, hashedCode, "EX", 120);
  expiredAt = dayjs().add(2, "minute");
  await SendMessage(
    phoneNumber,
    `Kode verifikasi akun Electrobuzz Anda adalah: ${code}`
  );

  return { data: verifId, expiredAt };
}
