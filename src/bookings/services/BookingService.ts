import {BookStatusEnum, TBookingModel} from "@/bookings/types";
import {deleteImg, uploadImg} from "@/core/lib/image";
import {BookingRepository} from "@/bookings/repositories/BookingRepository";
import {getAddress} from "@/users/services/AddressService";
import {SearchParams} from "@/core/lib/utils";

export async function addBooking(data: TBookingModel) {
  let result;
  if (!data.userId || !data.merchantId) {
    throw new Error("userId and merchantId are required");
  }

  if (data.userId === data.merchantId) {
    throw new Error("user can not book their own merchant");
  }

  await getAddress(data.userId, data.addressId);

  try {
    data.bookingPhotoUrl = await uploadImg(data.bookingPhotoUrl);
    data.bookingStatus = BookStatusEnum.Enum.pending;
    result = await BookingRepository.create(data);
  } catch (e) {
    await deleteImg(data.bookingPhotoUrl);
    throw e;
  }

  return result;
}

export async function countMerchantBookings(merchantId: string, options?: SearchParams) {
  return await BookingRepository.countByMerchantId(merchantId, options);
}

export async function countUserBookings(userId: string, options?: SearchParams) {
  return await BookingRepository.countByUserId(userId, options);
}

export async function getMerchantBookings(merchantId: string, options?: SearchParams) {
  return await BookingRepository.findByMerchantId(merchantId, options);
}

export async function getUserBookings(userId: string, options?: SearchParams) {
  return await BookingRepository.findByUserId(userId, options);
}