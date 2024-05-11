import {IdentityStatuses, MerchantIdentitiesModel} from "@/merchants/types";
import {decrypt, encrypt} from "@/core/lib/security";
import {deleteImg, getImg, uploadImg} from "@/core/lib/image";
import {MerchantIdentityRepository} from "@/merchants/repositories/MerchantIdentityRepository";
import {ErrorCode} from "@/core/lib/errors";
import {addMerchantIndex, getMerchant} from "@/merchants/services/MerchantService";

export async function addMerchantIdentity(merchantId: string, data: MerchantIdentitiesModel) {
  let images = [], merchantIdentity;

  try {
    merchantIdentity = await MerchantIdentityRepository.findOne(merchantId);
  } catch (e) {
  }
  if (merchantIdentity) {
    throw new Error(ErrorCode.ErrConflict)
  }

  data.identityStatus = IdentityStatuses.Enum.pending;
  data.merchantId = merchantId;
  try {
    const encryptedKTP = await encrypt(data.identityKTP);
    data.identityKTP = await uploadImg(encryptedKTP, {
      filename: `ktp-${merchantId}`,
      bucket: "vault",
    });
    images.push(data.identityKTP);

    const encryptedSKCK = await encrypt(data.identitySKCK);
    data.identitySKCK = await uploadImg(encryptedSKCK, {
        filename: `skck-${merchantId}`,
        bucket: "vault",
      }
    );
    images.push(data.identitySKCK);

    if (data.identityDocs) {
      const encryptedDocs = await encrypt(data.identityDocs)
      data.identityDocs = await uploadImg(encryptedDocs, {
          filename: `docs-${merchantId}`,
          bucket: "vault",
        }
      );
      images.push(data.identityDocs);
    }

    await MerchantIdentityRepository.create(data)
  } catch (e) {
    images.map(async (image) => {
      await deleteImg(image);
    });

    throw e;
  }
}

export async function editMerchantIdentity(merchantId: string, status: IdentityStatuses) {
  await MerchantIdentityRepository.update(merchantId, status);

  if (status === IdentityStatuses.Enum.rejected) {
    const identity = await MerchantIdentityRepository.findOne(merchantId);
    await deleteImg(identity?.identityKTP as string, "vault");
    await deleteImg(identity?.identitySKCK as string, "vault");
    if (identity?.identityDocs) {
      await deleteImg(identity.identityDocs, "vault");
    }
  } else if (status === IdentityStatuses.Enum.verified) {
    const merchant = await getMerchant(merchantId);
    await addMerchantIndex(merchant);
  }
}

export async function getMerchantIdentity(merchantId: string) {
  let result, ktp, skck, cert;

  result = await MerchantIdentityRepository.findOne(merchantId);
  if (!result) return;

  ktp = await getImg(result.identityKTP as string, "vault");
  skck = await getImg(result.identitySKCK as string, "vault");
  if (result?.identityDocs) {
    cert = await getImg(result.identityDocs, "vault");
  }

  result.identityKTP = await decrypt(ktp);
  result.identitySKCK = await decrypt(skck);
  if (cert) {
    result.identityDocs = await decrypt(cert);
  }

  return result;
}