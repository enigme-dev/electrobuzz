import { IdentityStatuses, TRegisterMerchantSchema } from "@/merchants/types";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { encrypt } from "@/core/lib/security";
import { MerchantRepository } from "@/merchants/repositories/MerchantRepository";
import { SearchParams } from "@/core/lib/utils";
import { getPrivateProfile } from "@/users/services/UserService";

export async function addMerchantIndex(data: any) {
  return MerchantRepository.createIndex(data);
}

export async function countMerchants(options?: SearchParams) {
  return MerchantRepository.count(options);
}

export async function getMerchant(merchantId: string) {
  return MerchantRepository.findOne(merchantId);
}

export async function getMerchants(options?: SearchParams) {
  return MerchantRepository.findAll(options);
}

export async function registerMerchant(
  userId: string,
  data: TRegisterMerchantSchema
) {
  let images = [];

  const user = await getPrivateProfile(userId);
  if (!user?.phoneVerified) throw new Error("phone has not been verified");

  try {
    data.merchantPhotoUrl = await uploadImg(data.merchantPhotoUrl);
    data.merchantAvailable = true;
    data.merchantIdentity.identityStatus = IdentityStatuses.Enum.pending;

    const encryptedKtp = await encrypt(data.merchantIdentity.identityKTP);
    data.merchantIdentity.identityKTP = await uploadImg(encryptedKtp, {
      filename: `ktp-${userId}`,
      bucket: "vault",
    });
    images.push(data.merchantIdentity.identityKTP);

    const encryptedSkck = await encrypt(data.merchantIdentity.identitySKCK);
    data.merchantIdentity.identitySKCK = await uploadImg(encryptedSkck, {
      filename: `skck-${userId}`,
      bucket: "vault",
    });
    images.push(data.merchantIdentity.identitySKCK);

    if (data.merchantIdentity.identityDocs) {
      data.merchantIdentity.identityDocs = await uploadImg(
        data.merchantIdentity.identityDocs,
        {
          filename: `docs-${userId}`,
          bucket: "vault",
        }
      );
      images.push(data.merchantIdentity.identityDocs);
    }

    await MerchantRepository.create(userId, data);
  } catch (e) {
    await deleteImg(data.merchantPhotoUrl);

    images.map(async (image) => {
      await deleteImg(image);
    });

    throw e;
  }
}

export async function updateMerchantVerified(
  merchantId: string,
  merchantVerified: boolean
) {
  return MerchantRepository.update(merchantId, { merchantVerified });
}
