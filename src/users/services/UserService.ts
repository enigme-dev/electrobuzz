import {UserRepository} from "@/users/repositories/UserRepository";
import {UpdateProfileModel} from "@/users/types";
import {deleteImg, uploadImg} from "@/core/lib/image";

export async function getPublicProfile(userId: string) {
  const user = await UserRepository.findOne(userId)
  return {name: user.name, image: user.image}
}

export async function getPrivateProfile(userId: string) {
  const user = await UserRepository.findOne(userId)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    image: user.image,
    isAdmin: user.isAdmin,
  }
}

export async function updatePhoneVerification(userId: string, phoneVerified: boolean) {
  await UserRepository.update(userId, {phoneVerified})
}

export async function updateProfile(userId: string, data: UpdateProfileModel) {
  let imageUrl;
  const user = await UserRepository.findOne(userId)

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