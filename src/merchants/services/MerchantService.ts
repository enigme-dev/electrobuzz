import {
  BillingStatusEnum,
  IdentityStatuses,
  TBillingStatusEnum,
  TCreateBillingsSchema,
  TRegisterMerchantSchema,
  TUpdateMerchantSchema,
} from "@/merchants/types";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { encrypt } from "@/core/lib/security";
import { MerchantRepository } from "@/merchants/repositories/MerchantRepository";
import { SearchParams } from "@/core/lib/utils";
import { getPrivateProfile } from "@/users/services/UserService";
import { ErrorCode } from "@/core/lib/errors";
import { Cache } from "@/core/lib/cache";
import { BookStatusEnum } from "@/bookings/types";
import dayjs from "dayjs";
import { MONTHLY_FEES, createBillings } from "./BillingService";

export async function addMerchantIndex(data: any) {
  return MerchantRepository.createIndex(data);
}

export async function chargeMonthlyFees() {
  const firstDayOfMonth = dayjs().startOf("month").toDate();
  const lastDayOfMonth = dayjs().endOf("month").toDate();
  const merchants = await MerchantRepository.countBookings(
    BookStatusEnum.Enum.done,
    { startDate: firstDayOfMonth, endDate: lastDayOfMonth }
  );

  let billings: TCreateBillingsSchema = [];
  merchants.forEach((merchant) => {
    const bookingsCt = merchant._count.bookings;
    const totalAmount = MONTHLY_FEES * bookingsCt;

    // wave billing if amount is zero
    let billingStatus: TBillingStatusEnum = BillingStatusEnum.Enum.pending;
    if (totalAmount === 0) {
      billingStatus = BillingStatusEnum.Enum.success;
    }

    billings.push({
      merchantId: merchant.merchantId,
      billingQty: bookingsCt,
      billingAmount: totalAmount,
      billingStatus: BillingStatusEnum.Enum.pending,
    });
  });

  await createBillings(billings);
}

export async function deleteMerchantIndex(merchantId: string) {
  return MerchantRepository.deleteIndex(merchantId);
}

export async function getMerchant(merchantId: string) {
  return MerchantRepository.findOne(merchantId);
}

export async function getMerchants(options?: SearchParams) {
  return MerchantRepository.findAll(options);
}

export async function getMerchantsAdmin(options?: SearchParams) {
  return MerchantRepository.findAllAdmin(options);
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

export async function updateMerchantProfile(
  merchantId: string,
  input: TUpdateMerchantSchema
) {
  const merchant = await getMerchant(merchantId);
  if (!merchant.merchantVerified) {
    throw new Error(ErrorCode.ErrMerchantUnverified);
  }

  if (input.merchantPhotoUrl?.startsWith("data:image")) {
    input.merchantPhotoUrl = await uploadImg(input.merchantPhotoUrl);
    await deleteImg(merchant.merchantPhotoUrl);
  }

  const updated = await MerchantRepository.update(merchantId, input);

  await addMerchantIndex(updated);

  // delete cached merchants
  Cache.delete(`merchant/${merchantId}`);
  Cache.delete("merchantsCt");
  Cache.deleteWithPrefix(`merchants/`);
}

export async function updateMerchantVerified(
  merchantId: string,
  merchantVerified: boolean
) {
  // delete cached merchants
  Cache.delete(`merchant/${merchantId}`);
  Cache.delete("merchantsCt");
  Cache.deleteWithPrefix(`merchants/`);
  return MerchantRepository.update(merchantId, { merchantVerified });
}
