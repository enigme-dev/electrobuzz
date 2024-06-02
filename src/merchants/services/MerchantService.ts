import {
  IdentityStatuses,
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
import { MONTHLY_FEES, createBillings, getBillings } from "./BillingService";
import { createNotification } from "@/notifications/services/NotificationService";
import { editMerchantIdentity } from "./MerchantIdentityService";
import { upsertMerchantBenefits } from "./MerchantBenefitService";

export async function addMerchantIndex(data: any) {
  return MerchantRepository.createIndex(data);
}

export async function chargeMonthlyFees() {
  const firstDayOfMonth = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .toDate();
  const lastDayOfMonth = dayjs(firstDayOfMonth).endOf("month").toDate();

  const merchants = await MerchantRepository.countBookings(
    BookStatusEnum.Enum.done,
    { startDate: firstDayOfMonth, endDate: lastDayOfMonth }
  );

  let billings: TCreateBillingsSchema = [];
  merchants.forEach((merchant) => {
    const bookingsCt = merchant._count.bookings;
    const totalAmount = MONTHLY_FEES * bookingsCt;

    // wave billing if amount is zero
    let billingPaid = totalAmount === 0;

    // notify merchant for new billing
    createNotification(merchant.merchantId, {
      service: "billing",
      level: "info",
      title: "Anda memiliki billing baru",
    });

    billings.push({
      merchantId: merchant.merchantId,
      billingQty: bookingsCt,
      billingAmount: totalAmount,
      billingPaid,
    });
  });

  if (billings.length > 0) {
    await createBillings(billings);
  }
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

export async function suspendUnpaidMerchant() {
  const firstDayOfMonth = dayjs().startOf("month").toDate();
  const merchants = await getBillings({
    startDate: firstDayOfMonth,
    status: "unpaid",
  });

  merchants.map(async (merchant) => {
    // notify suspended merchant
    createNotification(merchant.merchantId, {
      service: "billing",
      level: "error",
      title: "Akun Mitra Anda dibekukan",
      message: "Mohon segera lakukan pelunasan billing",
      actionUrl: merchant.billingId,
    });

    await editMerchantIdentity(
      merchant.merchantId,
      IdentityStatuses.Enum.suspended
    );
  });
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

  if (input.merchantBanner?.startsWith("data:image")) {
    input.merchantBanner = await uploadImg(input.merchantBanner);
    if (merchant.merchantBanner) {
      await deleteImg(merchant.merchantBanner);
    }
  }

  const data = {
    merchantName: input.merchantName,
    merchantDesc: input.merchantDesc,
    merchantPhotoUrl: input.merchantPhotoUrl,
    merchantCity: input.merchantCity,
    merchantProvince: input.merchantProvince,
    merchantLat: input.merchantLat,
    merchantLong: input.merchantLong,
    merchantCategory: input.merchantCategory,
    merchantAvailable: input.merchantAvailable,
  };
  const updatedMerchant = await MerchantRepository.update(merchantId, data);

  await addMerchantIndex(updatedMerchant);

  if (input.benefits && input.benefits.length > 0) {
    await upsertMerchantBenefits(merchantId, input.benefits);
  }

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
