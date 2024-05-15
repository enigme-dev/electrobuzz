import { UserRepository } from "@/users/repositories/UserRepository";
import { TVerifyOTPSchema, UpdateProfileModel } from "@/users/types";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { ErrorCode } from "@/core/lib/errors";
import { checkOTP, sendOTP } from "./VerificationService";
import { hash } from "@/core/lib/security";

export async function getPublicProfile(userId: string) {
  const user = await UserRepository.findOne(userId);
  return { name: user.name, image: user.image };
}

export async function getPrivateProfile(userId: string) {
  const user = await UserRepository.findOne(userId);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    image: user.image,
    isAdmin: user.isAdmin,
  };
}

export async function checkPhoneVerification(
  userId: string,
  data: TVerifyOTPSchema
) {
  const user = await UserRepository.findOne(userId);
  if (!user) throw new Error(ErrorCode.ErrNotFound);

  if (!user.phone) throw new Error(ErrorCode.ErrOTPNotRegistered);

  if (user.phoneVerified) throw new Error(ErrorCode.ErrOTPVerified);

  const hashed = hash(user.phone);
  if (data.verifId != hashed) throw new Error(ErrorCode.ErrOTPNotFound);

  const status = await checkOTP(data.verifId, data.code);
  if (status === "correct") await updatePhoneVerification(userId, true);

  return status;
}

export async function requestPhoneVerification(userId: string) {
  const user = await UserRepository.findOne(userId);
  if (!user) throw new Error(ErrorCode.ErrNotFound);

  if (!user.phone) throw new Error(ErrorCode.ErrOTPNotRegistered);

  if (user.phoneVerified) throw new Error(ErrorCode.ErrOTPVerified);

  return await sendOTP(user.phone);
}

export async function updatePhoneVerification(
  userId: string,
  phoneVerified: boolean
) {
  await UserRepository.update(userId, { phoneVerified });
}

export async function updateProfile(userId: string, data: UpdateProfileModel) {
  let imageUrl;
  const user = await UserRepository.findOne(userId);

  data.phoneVerified = data.phone === user?.phone ? user?.phoneVerified : false;

  if (data.image?.startsWith("data:image")) {
    if (user?.image?.startsWith(process.env.ASSETS_URL as string)) {
      await deleteImg(user?.image);
    }

    imageUrl = await uploadImg(data.image);
  }

  data.image = imageUrl;

  try {
    await UserRepository.update(userId, data);
  } catch (e) {
    if (imageUrl) {
      await deleteImg(imageUrl);
    }
  }
}
