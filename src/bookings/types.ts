import { MerchantModel } from "@/merchants/types";
import { z } from "zod";

/**
 * expired: booking expired
 * pending: waiting for merchant
 * accepted: merchant accepted
 * rejected: merchant rejected
 * canceled: user canceled
 * in_progress: service in progress
 * done: user done
 */
export const BookStatusEnum = z.enum([
  "expired",
  "pending",
  "accepted",
  "rejected",
  "canceled",
  "in_progress",
  "done",
]);

export const ReviewModel = z.object({
  reviewId: z.string().optional(),
  reviewBody: z.string(),
  reviewStars: z.number(),
  reviewCreatedAt: z.date().optional(),
  userId: z.string().optional(),
  merchantId: z.string().optional(),
  bookingId: z.string().optional(),
});

export type TReviewModel = z.infer<typeof ReviewModel>;

export const CreateReviewSchema = z.object({
  reviewBody: z
    .string({ required_error: "Tolong deskripsikan hasil servicemu" })
    .min(8)
    .max(128),
  reviewStars: z
    .number({ required_error: "Tolong berikan ratingmu" })
    .min(1)
    .max(5),
});

export type TCreateReviewSchema = z.infer<typeof CreateReviewSchema>;

export type BookStatusEnum = z.infer<typeof BookStatusEnum>;

export const BookingModel = z.object({
  bookingId: z.string().cuid().optional(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.date(),
  bookingStatus: BookStatusEnum.optional(),
  bookingReason: z.string().nullish(),
  bookingPriceMin: z.number().nullish(),
  bookingPriceMax: z.number().nullish(),
  bookingDesc: z.string().nullish(),
  bookingCreatedAt: z.date().optional(),
  addressDetail: z.string().optional(),
  addressZipCode: z.string().optional(),
  addressCity: z.string().optional(),
  addressProvince: z.string().optional(),
  userId: z.string().cuid().optional(),
  merchantId: z.string().cuid().optional(),
});

export type TBookingModel = z.infer<typeof BookingModel>;

export const GetMerchantBookings = z
  .object({
    bookingId: z.string().cuid(),
    bookingStatus: BookStatusEnum,
    bookingComplain: z.string(),
    bookingPhotoUrl: z.string(),
    bookingPriceMin: z.number().nullish(),
    bookingPriceMax: z.number().nullish(),
    bookingSchedule: z.date(),
    bookingCreatedAt: z.date(),
    user: z.object({
      id: z.string().cuid(),
      name: z.string(),
      image: z.string(),
    }),
  })
  .array();

export type TGetMerchantBookings = z.infer<typeof GetMerchantBookings>;

export const GetMerchantBookingPending = z.object({
  bookingId: z.string().cuid(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.date(),
  bookingStatus: BookStatusEnum,
  bookingCreatedAt: z.date(),
  addressDetail: z.string(),
  addressZipCode: z.string(),
  addressCity: z.string(),
  addressProvince: z.string(),
  user: z.object({
    name: z.string(),
    phone: z.string(),
  }),
});

export type TGetMerchantBookingPending = z.infer<
  typeof GetMerchantBookingPending
>;

export const GetMerchantBookingAccepted = GetMerchantBookingPending.extend({
  bookingPriceMin: z.number(),
  bookingPriceMax: z.number(),
  bookingDesc: z.string(),
});

export type TGetMerchantBookingAccepted = z.infer<
  typeof GetMerchantBookingAccepted
>;

export const GetMerchantBookingRejected = z.object({
  bookingId: z.string().cuid(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.date(),
  bookingStatus: BookStatusEnum,
  bookingReason: z.string(),
  bookingCreatedAt: z.date(),
  user: z.object({
    name: z.string(),
  }),
});

export type TGetMerchantBookingRejected = z.infer<
  typeof GetMerchantBookingRejected
>;

export const GetMerchantBookingCanceled = GetMerchantBookingRejected;

export type TGetMerchantBookingCanceled = z.infer<
  typeof GetMerchantBookingCanceled
>;

export const GetMerchantBookingExpired = GetMerchantBookingRejected.omit({
  bookingReason: true,
});

export type TGetMerchantBookingExpired = z.infer<
  typeof GetMerchantBookingExpired
>;

export const GetMerchantBookingInProgress = GetMerchantBookingAccepted;

export type TGetMerchantBookingInProgress = z.infer<
  typeof GetMerchantBookingInProgress
>;

export const GetMerchantBookingDone = GetMerchantBookingAccepted.extend({
  review: ReviewModel.nullish(),
});

export type TGetMerchantBookingDone = z.infer<typeof GetMerchantBookingDone>;

export const AcceptBookingSchema = z.object({
  bookingPriceMin: z
    .number({
      required_error: "estimation price can not be empty",
    })
    .min(20000, "estimation price can be between 20000 and 10000000")
    .max(10000000, "estimation price can be between 20000 and 10000000"),
  bookingPriceMax: z
    .number({
      required_error: "estimation price can not be empty",
    })
    .min(20000, "estimation price can be between 20000 and 10000000")
    .max(10000000, "estimation price can be between 20000 and 10000000"),
  bookingDesc: z.string(),
});

export type TAcceptBookingSchema = z.infer<typeof AcceptBookingSchema>;

export const BookingReasonSchema = z.object({
  bookingReason: z
    .string({
      required_error: "reason can not be empty",
    })
    .min(8, "reason can be between 8 and 256 characters")
    .max(256, "reason can be between 8 and 256 characters"),
});

export type TBookingReasonSchema = z.infer<typeof BookingReasonSchema>;

export const GetUserBooking = BookingModel.omit({
  userId: true,
  merchantId: true,
  bookingReason: true,
}).extend({
  bookingPriceMin: z.number().nullish(),
  bookingPriceMax: z.number().nullish(),
  bookingDesc: z.string().nullish(),
  merchant: MerchantModel.pick({
    merchantId: true,
    merchantName: true,
    merchantPhotoUrl: true,
  }).extend({ user: z.object({ phone: z.string() }) }),
});

export type TGetUserBooking = z.infer<typeof GetUserBooking>;

export const GetUserBookingPending = z.object({
  bookingId: z.string().cuid(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.date(),
  bookingStatus: BookStatusEnum,
  bookingCreatedAt: z.date(),
  addressDetail: z.string(),
  addressZipCode: z.string(),
  addressCity: z.string(),
  addressProvince: z.string(),
  merchant: MerchantModel.pick({
    merchantId: true,
    merchantName: true,
    merchantPhotoUrl: true,
  }).extend({ user: z.object({ phone: z.string() }) }),
});

export type TGetUserBookingPending = z.infer<typeof GetUserBookingPending>;

export const GetUserBookingRejected = GetUserBookingPending.extend({
  bookingReason: z.string(),
});

export type TGetUserBookingRejected = z.infer<typeof GetUserBookingRejected>;

export const GetUserBookingReason = GetUserBooking.extend({
  bookingReason: z.string(),
});

export type TGetUserBookingReason = z.infer<typeof GetUserBookingReason>;

export const GetUserBookingDone = GetUserBooking.extend({
  review: ReviewModel.nullish(),
});

export type TGetUserBookingDone = z.infer<typeof GetUserBookingDone>;

export const CreateBookingSchema = z.object({
  bookingPhotoUrl: z.string({ required_error: "photo can not be empty" }),
  bookingComplain: z.string({ required_error: "complain can not be empty" }),
  bookingSchedule: z
    .string({ required_error: "schedule can not be empty" })
    .datetime("schedule must be a datetime string"),
  addressId: z
    .string({ required_error: "address id can not be empty" })
    .cuid("address id must be a cuid"),
});

export type TCreateBookingSchema = z.infer<typeof CreateBookingSchema>;

export const CheckBookingCodeSchema = z.object({
  code: z.string().length(6),
});

export type TCheckBookingCodeSchema = z.infer<typeof CheckBookingCodeSchema>;
