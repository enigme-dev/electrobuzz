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
  GetUserBookingPending,
  GetUserBookingRejected,
  GetMerchantBookingExpired,
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
import { createNotification } from "@/notifications/services/NotificationService";
import { generateOTP } from "@/users/lib/verification";
import { RedisClient } from "@/core/adapters/redis";

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

  const address = await getAddress(userId, input.addressId);

  const [_, bookingCt] = await getUserBookings(userId, {
    status: BookStatusEnum.Enum.pending,
    perPage: 0,
  });

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
      addressDetail: address.addressDetail,
      addressZipCode: address.addressZipCode,
      addressCity: address.addressCity,
      addressProvince: address.addressProvince,
    };

    result = await BookingRepository.create(data);

    // create notif to merchant
    createNotification(merchantId, {
      service: "booking/merchant",
      level: "info",
      title: "Anda memiliki permintaan servis baru",
      photoUrl: data.bookingPhotoUrl,
      message: data.bookingComplain,
      actionUrl: result.bookingId,
    });
  } catch (e) {
    if (bookingPhotoUrl) {
      await deleteImg(bookingPhotoUrl);
    }

    throw e;
  }

  return result;
}

export async function createBookingCode(userId: string, bookingId: string) {
  let code, ttl;
  const booking = await getUserBooking(userId, bookingId);
  if (booking.bookingStatus != BookStatusEnum.Enum.accepted) {
    throw new Error(ErrorCode.ErrConflict);
  }

  if (!dayjs().isSame(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookWrongSchedule);
  }

  const key = `code/${bookingId}`;
  code = await RedisClient.get(key);
  ttl = await RedisClient.ttl(key);
  console.log(ttl);
  if (code) {
    return { code, expiredAt: dayjs().add(ttl, "s").toDate() };
  }

  code = generateOTP();
  RedisClient.set(key, code, "EX", 600);

  return { code, expiredAt: dayjs().add(10, "minutes").toDate() };
}

export async function flagDoneInProgressBooking() {
  const yesterday = dayjs().subtract(1, "day").toDate();
  await BookingRepository.updateManyStatus(BookStatusEnum.Enum.done, {
    AND: {
      bookingSchedule: { lte: yesterday },
      bookingStatus: BookStatusEnum.Enum.in_progress,
    },
  });
}

export async function flagExpiredAcceptedBooking() {
  const today = new Date();
  await BookingRepository.updateManyStatus(BookStatusEnum.Enum.expired, {
    AND: {
      bookingSchedule: { lte: today },
      bookingStatus: BookStatusEnum.Enum.accepted,
    },
  });
}

export async function flagExpiredPendingBooking() {
  const twoDaysAgo = dayjs().subtract(2, "days").toDate();
  await BookingRepository.updateManyStatus(BookStatusEnum.Enum.expired, {
    AND: {
      bookingCreatedAt: { lte: twoDaysAgo },
      bookingStatus: BookStatusEnum.Enum.pending,
    },
  });
}

export async function getMerchantBooking(
  merchantId: string,
  bookingId: string
) {
  const booking = await BookingRepository.findOne(bookingId, {
    user: true,
    review: {
      select: {
        reviewId: true,
        reviewBody: true,
        reviewStars: true,
        reviewCreatedAt: true,
      },
    },
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
    case BookStatusEnum.Enum.expired:
      return GetMerchantBookingExpired.parse(booking);
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
        merchantId: true,
        merchantName: true,
        merchantPhotoUrl: true,
        user: { select: { phone: true } },
      },
    },
    review: {
      select: {
        reviewId: true,
        reviewBody: true,
        reviewStars: true,
        reviewCreatedAt: true,
      },
    },
  });

  if (booking.userId !== userId) {
    throw new Error(ErrorCode.ErrNotFound);
  }

  const status = BookStatusEnum.parse(booking.bookingStatus);
  switch (status) {
    case BookStatusEnum.Enum.pending:
      return GetUserBookingPending.parse(booking);
    case BookStatusEnum.Enum.rejected:
      return GetUserBookingRejected.parse(booking);
    case BookStatusEnum.Enum.canceled:
      return GetUserBookingReason.parse(booking);
    case BookStatusEnum.Enum.done:
      return GetUserBookingDone.parse(booking);
    default:
      return GetUserBooking.parse(booking);
  }
}

export async function getUserBookings(userId: string, options?: SearchParams) {
  return await BookingRepository.findByUserId(userId, options);
}

export async function getUserReviews(userId: string, options?: SearchParams) {
  return await BookingRepository.findUserReviews(userId, options);
}

export async function setStatusAccepted(
  merchantId: string,
  bookingId: string,
  input: TAcceptBookingSchema
) {
  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.accepted,
    bookingPriceMin: input.bookingPriceMin,
    bookingPriceMax: input.bookingPriceMax,
    bookingDesc: input.bookingDesc,
  };

  const booking = await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.pending],
    data
  );

  // create notif to user
  createNotification(booking.userId, {
    service: "booking/user",
    level: "success",
    title: "Booking Anda telah diterima oleh Mitra",
    photoUrl: booking.bookingPhotoUrl ?? "",
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
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

  const { merchantId } = await BookingRepository.updateUserBookingStatus(
    userId,
    bookingId,
    [BookStatusEnum.Enum.pending, BookStatusEnum.Enum.accepted],
    data
  );

  // create notif to merchant
  createNotification(merchantId, {
    service: "booking/merchant",
    level: "error",
    title: "Booking Anda telah dibatalkan oleh pengguna",
    photoUrl: booking.bookingPhotoUrl,
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
}

export async function setStatusDone(userId: string, bookingId: string) {
  const booking = await getUserBooking(userId, bookingId);
  if (dayjs().isBefore(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookDoneTooEarly);
  }

  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.done,
  };

  const { merchantId } = await BookingRepository.updateUserBookingStatus(
    userId,
    bookingId,
    [BookStatusEnum.Enum.in_progress],
    data
  );

  // create notif to merchant
  createNotification(merchantId, {
    service: "booking/merchant",
    level: "success",
    title: "Booking Anda telah diselesaikan oleh pengguna",
    photoUrl: booking.bookingPhotoUrl,
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
}

export async function setStatusInProgress(
  merchantId: string,
  bookingId: string,
  code: string
) {
  const booking = await getMerchantBooking(merchantId, bookingId);
  if (!dayjs().isSame(booking.bookingSchedule, "date")) {
    throw new Error(ErrorCode.ErrBookWrongSchedule);
  }

  const key = `code/${bookingId}`;
  const savedCode = await RedisClient.get(key);
  if (savedCode != code) {
    throw new Error("invalid booking code");
  }

  const data: Prisma.BookingUpdateInput = {
    bookingStatus: BookStatusEnum.Enum.in_progress,
  };

  const { userId } = await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.accepted],
    data
  );

  RedisClient.del(key);

  // create notif to user
  createNotification(userId, {
    service: "booking/user",
    level: "info",
    title: "Mitra sedang mengerjakan permintaan servis",
    photoUrl: booking.bookingPhotoUrl,
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
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

  const booking = await BookingRepository.updateMerchantBookingStatus(
    merchantId,
    bookingId,
    [BookStatusEnum.Enum.pending],
    data
  );

  // create notif to user
  createNotification(booking.userId, {
    service: "booking/user",
    level: "error",
    title: "Booking Anda telah ditolak oleh Mitra",
    photoUrl: booking.bookingPhotoUrl ?? "",
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
}
