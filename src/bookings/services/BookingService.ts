import {
  BookStatusEnum,
  GetMerchantBookingAccepted,
  GetMerchantBookingCanceled,
  GetMerchantBookingDone,
  GetMerchantBookingPending,
  GetMerchantBookingRejected,
  GetMerchantBookings,
  TAcceptBookingSchema,
  TBookingModel,
  TGetMerchantBookings,
} from "@/bookings/types";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { BookingRepository } from "@/bookings/repositories/BookingRepository";
import { getAddress } from "@/users/services/AddressService";
import { SearchParams } from "@/core/lib/utils";
import { ErrorCode } from "@/core/lib/errors";
import { getMerchant } from "@/merchants/services/MerchantService";

export async function acceptBooking(
  merchantId: string,
  bookingId: string,
  data: TAcceptBookingSchema
) {
  return await BookingRepository.acceptBooking(merchantId, bookingId, data);
}

export async function addBooking(data: TBookingModel) {
  let result;
  if (!data.userId || !data.merchantId) {
    throw new Error("userId and merchantId are required");
  }

  if (data.userId === data.merchantId) {
    throw new Error("user can not book their own merchant");
  }

  const merchant = await getMerchant(data.merchantId);
  if (!merchant.merchantAvailable || !merchant.merchantVerified)
    throw new Error(ErrorCode.ErrNotFound);

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

export async function getMerchantBooking(
  merchantId: string,
  bookingId: string
) {
  const booking = await BookingRepository.findOnePrivate(bookingId);
  if (booking.merchantId !== merchantId) throw new Error(ErrorCode.ErrNotFound);

  switch (booking.bookingStatus) {
    case BookStatusEnum.Enum.pending:
      return GetMerchantBookingPending.parse(booking);
    case BookStatusEnum.Enum.accepted:
      return GetMerchantBookingAccepted.parse(booking);
    case BookStatusEnum.Enum.rejected:
      return GetMerchantBookingRejected.parse(booking);
    case BookStatusEnum.Enum.canceled:
      return GetMerchantBookingCanceled.parse(booking);
    case BookStatusEnum.Enum.done:
      return GetMerchantBookingDone.parse(booking);
    default:
      throw new Error(ErrorCode.ErrNotFound);
  }
}

export async function getMerchantBookings(
  merchantId: string,
  options?: SearchParams
): Promise<[TGetMerchantBookings, number]> {
  const [bookings, bookingsCt] = await BookingRepository.findByMerchantId(
    merchantId,
    options
  );
  const result = GetMerchantBookings.parse(bookings);

  return [result, bookingsCt];
}

export async function getUserBookings(userId: string, options?: SearchParams) {
  return await BookingRepository.findByUserId(userId, options);
}
