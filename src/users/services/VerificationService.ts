import {VerificationRepository} from "@/users/repositories/VerificationRepository";

export async function addVerification(verifId: string, code: string) {
  return await VerificationRepository.upsert(verifId, code)
}

export async function getVerification(verifId: string) {
  return await VerificationRepository.findOne(verifId);
}