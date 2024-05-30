import { SearchParams } from "@/core/lib/utils";
import { ReviewRepository } from "../repositories/ReviewRepository";
import {
  BookStatusEnum,
  GetUserBookingDone,
  TCreateReviewSchema,
  TReviewModel,
} from "../types";
import { getUserBooking } from "./BookingService";
import { addMerchantIndex } from "@/merchants/services/MerchantService";
import { createNotification } from "@/notifications/services/NotificationService";

export async function createReview(
  bookingId: string,
  userId: string,
  input: TCreateReviewSchema
) {
  const booking = await getUserBooking(userId, bookingId);
  const merchantId = booking.merchant.merchantId;
  if (booking.bookingStatus != BookStatusEnum.Enum.done) {
    throw new Error("booking is not done");
  }

  const doneBooking = GetUserBookingDone.parse(booking);
  if (doneBooking.review) {
    throw new Error("review has already exist");
  }

  const data: TReviewModel = {
    reviewBody: input.reviewBody,
    reviewStars: input.reviewStars,
    bookingId,
    userId,
    merchantId,
  };
  const merchant = await ReviewRepository.create(data);
  await addMerchantIndex(merchant);

  // create notif to merchant
  createNotification(merchant.merchantId, {
    service: "booking/merchant",
    level: "info",
    title: "Anda mendapatkan ulasan baru",
    photoUrl: booking.bookingPhotoUrl,
    message: booking.bookingComplain,
    actionUrl: bookingId,
  });
}

export async function getMerchantReviews(
  merchantId: string,
  options?: SearchParams
) {
  return await ReviewRepository.findMerchantReviews(merchantId, options);
}

export async function getUserReviews(userId: string, options?: SearchParams) {
  return await ReviewRepository.findUserReviews(userId, options);
}
