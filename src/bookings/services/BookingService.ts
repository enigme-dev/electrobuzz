import {
  BookStatusEnum,
  GetMerchantBookingAccepted,
  GetMerchantBookingCanceled,
  GetMerchantBookingDone,
  GetMerchantBookingInProgress,
  GetMerchantBookingPending,
  GetMerchantBookingRejected,
  GetMerchantBookings,
  GetUserBooking,
  GetUserBookingDone,
  GetUserBookingReason,
  TAcceptBookingSchema,
  TBookingModel,
  TGetMerchantBookings,
  TBookingReasonSchema,
  TCreateBookingSchema,
} from "@/bookings/types";
import { deleteImg, uploadImg } from "@/core/lib/image";
import { BookingRepository } from "@/bookings/repositories/BookingRepository";
import { getAddress } from "@/users/services/AddressService";
import { SearchParams } from "@/core/lib/utils";
import { ErrorCode } from "@/core/lib/errors";
import { getMerchant } from "@/merchants/services/MerchantService";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

export async function addBooking(
  userId: string,
  merchantId: string,
  input: TCreateBookingSchema
) {
  let result, bookingPhotoUrl;

  if (userId === merchantId) {
    throw new Error("user can not book their own merchant");
  }

  const merchant = await getMerchant(merchantId);
  if (!merchant.merchantAvailable || !merchant.merchantVerified)
    throw new Error(ErrorCode.ErrNotFound);

  await getAddress(userId, input.addressId);

  const [_, bookingCt] = await getUserBookings(userId, {
    status: BookStatusEnum.Enum.pending,
    perPage: 0,
  });
  console.log(bookingCt);
  if (bookingCt >= 5) {
    throw new Error(ErrorCode.ErrTooManyRequest);
  }

  const bookingSchedule = new Date(input.bookingSchedule);
  dayjs.extend(isSameOrBefore);
  if (dayjs(bookingSchedule).isSameOrBefore(dayjs())) {
    throw new Error(ErrorCode.ErrBookInvalidSchedule);
  }

  try {
    bookingPhotoUrl = await uploadImg(input.bookingPhotoUrl);
    const data: TBookingModel = {
      ...input,
      userId,
      merchantId,
      bookingSchedule,
      bookingStatus: BookStatusEnum.Enum.pending,
      bookingPhotoUrl,
    };

    result = await BookingRepository.create(data);
  } catch (e) {
    if (bookingPhotoUrl) {
      await deleteImg(bookingPhotoUrl);
    }

    throw e;
  }

  return result;
}

export async function getMerchantBooking(
  merchantId: string,
  bookingId: string
) {
  const booking = await BookingRepository.findOne(bookingId, {
    address: true,
    user: true,
  });
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
    case BookStatusEnum.Enum.in_progress:
      return GetMerchantBookingInProgress.parse(booking);
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

export async function getUserBooking(userId: string, bookingId: string) {
  const booking = await BookingRepository.findOne(bookingId, {
    merchant: {
      select: {
        merchantName: true,
        merchantPhotoUrl: true,
        user: { select: { phone: true } },
      },
    },
    address: true,
  });

  if (booking.userId !== userId) {
    throw new Error(ErrorCode.ErrNotFound);
  }

  const status = BookStatusEnum.parse(booking.bookingStatus);
  if (status === BookStatusEnum.Enum.done) {
    return GetUserBookingDone.parse(booking);
  }

  if (
    status === BookStatusEnum.Enum.canceled ||
    status === BookStatusEnum.Enum.rejected
  ) {
    return GetUserBookingReason.parse(booking);
  }

  return GetUserBooking.parse(booking);
}

export async function getUserBookings(userId: string, options?: SearchParams) {
  return await BookingRepository.findByUserId(userId, options);
}

export async function setStatusAccepted(
  merchantId: string,
  bookingId: string,
  input: TAcceptBookingSchema
) {
  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.accepted,
    bookingPrice: input.bookingPrice,
  };

  await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.pending],
    data
  );
}

export async function setStatusCanceled(
  userId: string,
  bookingId: string,
  input: TBookingReasonSchema
) {
  const booking = await getUserBooking(userId, bookingId);
  if (dayjs().isSame(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookCancelation);
  }

  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.canceled,
    bookingReason: input.bookingReason,
  };

  await BookingRepository.updateUserBookingStatus(
    userId,
    bookingId,
    [BookStatusEnum.Enum.pending, BookStatusEnum.Enum.accepted],
    data
  );
}

export async function setStatusDone(userId: string, bookingId: string) {
  const booking = await getUserBooking(userId, bookingId);
  if (dayjs().isBefore(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookDoneTooEarly);
  }

  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.done,
  };

  await BookingRepository.updateUserBookingStatus(
    userId,
    bookingId,
    [BookStatusEnum.Enum.in_progress],
    data
  );
}

export async function setStatusInProgress(
  merchantId: string,
  bookingId: string
) {
  const booking = await getMerchantBooking(merchantId, bookingId);
  if (!dayjs().isSame(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookWrongSchedule);
  }

  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.in_progress,
  };

  await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.accepted],
    data
  );
}

export async function setStatusRejected(
  merchantId: string,
  bookingId: string,
  input: TBookingReasonSchema
) {
  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.rejected,
    bookingReason: input.bookingReason,
  };

  await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.pending],
    data
  );
}
