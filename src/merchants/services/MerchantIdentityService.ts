import {
  TIdentityStatuses,
  TMerchantIdentityModel,
  IdentityStatuses,
} from "@/merchants/types";
import { decrypt, encrypt } from "@/core/lib/security";
import { deleteImg, getImg, uploadImg } from "@/core/lib/image";
import { MerchantIdentityRepository } from "@/merchants/repositories/MerchantIdentityRepository";
import { ErrorCode } from "@/core/lib/errors";
import {
  addMerchantIndex,
  deleteMerchantIndex,
  getMerchant,
  updateMerchantVerified,
} from "@/merchants/services/MerchantService";
import { createNotification } from "@/notifications/services/NotificationService";
import { Logger } from "@/core/lib/logger";

export async function addMerchantIdentity(
  merchantId: string,
  data: TMerchantIdentityModel
) {
  let images = [],
    merchantIdentity;

  try {
    merchantIdentity = await MerchantIdentityRepository.findOne(merchantId);
  } catch (e) {
    Logger.error(
      "merchant-identity",
      "get merchant identity repository error",
      e
    );
  }
  if (merchantIdentity) {
    throw new Error(ErrorCode.ErrConflict);
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
    });
    images.push(data.identitySKCK);

    if (data.identityDocs) {
      const encryptedDocs = await encrypt(data.identityDocs);
      data.identityDocs = await uploadImg(encryptedDocs, {
        filename: `docs-${merchantId}`,
        bucket: "vault",
      });
      images.push(data.identityDocs);
    }

    await MerchantIdentityRepository.create(data);
  } catch (e) {
    images.map(async (image) => {
      await deleteImg(image);
    });

    throw e;
  }
}

export async function editMerchantIdentity(
  merchantId: string,
  data: TMerchantIdentityModel
) {
  let images = [],
    merchantIdentity;

  try {
    merchantIdentity = await MerchantIdentityRepository.findOne(merchantId);
  } catch (e) {
    Logger.error(
      "merchant-identity",
      "get merchant identity repository error",
      e
    );
  }

  if (merchantIdentity?.identityStatus != "rejected") {
    throw new Error(ErrorCode.ErrConflict);
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
    });
    images.push(data.identitySKCK);

    if (data.identityDocs) {
      const encryptedDocs = await encrypt(data.identityDocs);
      data.identityDocs = await uploadImg(encryptedDocs, {
        filename: `docs-${merchantId}`,
        bucket: "vault",
      });
      images.push(data.identityDocs);
    }

    await MerchantIdentityRepository.create(data);
  } catch (e) {
    images.map(async (image) => {
      await deleteImg(image);
    });

    throw e;
  }
}

export async function editMerchantIdentityStatus(
  merchantId: string,
  status: TIdentityStatuses
) {
  await MerchantIdentityRepository.update(merchantId, status);

  if (status === IdentityStatuses.Enum.rejected) {
    await updateMerchantVerified(merchantId, false);
    await deleteMerchantIndex(merchantId);

    const identity = await MerchantIdentityRepository.findOne(merchantId);
    await deleteImg(identity?.identityKTP as string, "vault");
    await deleteImg(identity?.identitySKCK as string, "vault");
    if (identity?.identityDocs) {
      await deleteImg(identity.identityDocs, "vault");
    }

    createNotification(merchantId, {
      service: "identity",
      title: "Identitas Mitra Anda ditolak",
      level: "error",
    });
  } else if (status === IdentityStatuses.Enum.verified) {
    const merchant = await getMerchant(merchantId);
    await updateMerchantVerified(merchantId, true);
    await addMerchantIndex(merchant);

    createNotification(merchantId, {
      service: "identity",
      title: "Identitas Mitra Anda diterima",
      level: "success",
    });
  } else if (status === IdentityStatuses.Enum.suspended) {
    await updateMerchantVerified(merchantId, false);
    await deleteMerchantIndex(merchantId);

    createNotification(merchantId, {
      service: "identity",
      title: "Akun Mitra Anda dibekukan",
      level: "error",
    });
  }
}

export async function getMerchantIdentity(merchantId: string) {
  let result, ktp, skck;

  result = await MerchantIdentityRepository.findOne(merchantId);
  if (!result) return;

  ktp = await getImg(result.identityKTP as string, "vault");
  skck = await getImg(result.identitySKCK as string, "vault");
  if (result?.identityDocs) {
    result.identityDocs = await getImg(result.identityDocs, "vault");
  }

  result.identityKTP = await decrypt(ktp);
  result.identitySKCK = await decrypt(skck);

  return result;
}
