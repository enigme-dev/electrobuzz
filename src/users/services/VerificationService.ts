import { SendMessage } from "@/core/adapters/watzap";
import dayjs from "dayjs";
import { generateOTP } from "../lib/verification";
import { VerifyStatuses } from "../types";
import { hash } from "@/core/lib/security";
import { Cache } from "@/core/lib/cache";

export async function checkOTP(verifId: string, code: string) {
  let verification;
  const key = `code/${verifId}`;

  verification = Cache.get(key);

  if (!verification) {
    return VerifyStatuses.Enum.not_found;
  }

  const hashedCode = hash(code);
  if (verification != hashedCode) {
    return VerifyStatuses.Enum.incorrect;
  }

  Cache.delete(key);

  return VerifyStatuses.Enum.correct;
}

export async function sendOTP(phoneNumber: string) {
  let ttl, expiredAt;
  const verifId = hash(phoneNumber);
  const key = `code/${verifId}`;
  const code = generateOTP();

  ttl = Cache.getTTL(key);
  if (ttl && ttl > 0) {
    return {
      error: "ErrTooManyRequest",
      expiredAt: dayjs.unix(ttl / 1000).toDate(),
    };
  }

  const hashedCode = hash(code);
  Cache.set(key, hashedCode, 120);
  expiredAt = dayjs().add(2, "minute");
  await SendMessage(
    phoneNumber,
    `Kode verifikasi akun Electrobuzz Anda adalah: ${code}`
  );

  return { data: verifId, expiredAt };
}
