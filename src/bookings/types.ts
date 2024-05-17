import { AddressSchema, UserModel } from "@/users/types";
import { z } from "zod";

export const BookStatusEnum = z.enum([
  "pending", // waiting for merchant
  "accepted", // merchant accepted
  "rejected", // merchant rejected
  "canceled", // user canceled
  "in_progress", // service in progress
  "done", // user done
]);

export type BookStatusEnum = z.infer<typeof BookStatusEnum>;

export const BookingModel = z.object({
  bookingId: z.string().cuid().optional(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.date(),
  bookingStatus: BookStatusEnum.optional(),
  bookingReason: z.string().optional(),
  bookingPrice: z.number().optional(),
  bookingCreatedAt: z.date().optional(),
  addressId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  merchantId: z.string().cuid().optional(),
});

export type TBookingModel = z.infer<typeof BookingModel>;

export const GetMerchantBookings = BookingModel.pick({
  bookingId: true,
  bookingSchedule: true,
  bookingStatus: true,
  bookingPrice: true,
  bookingCreatedAt: true,
})
  .extend({ bookingPrice: z.number().nullable().optional() })
  .array();

export type TGetMerchantBookings = z.infer<typeof GetMerchantBookings>;

export const GetMerchantBookingPending = BookingModel.omit({
  bookingPrice: true,
  bookingReason: true,
  userId: true,
  addressId: true,
  merchantId: true,
}).extend({
  user: UserModel.pick({ name: true, phone: true }),
  address: AddressSchema.pick({
    addressDetail: true,
    addressCity: true,
    addressProvince: true,
    addressZipCode: true,
  }),
});

export type TGetMerchantBookingPending = z.infer<
  typeof GetMerchantBookingPending
>;

export const GetMerchantBookingAccepted = GetMerchantBookingPending.extend({
  bookingPrice: z.number(),
});

export type TGetMerchantBookingAccepted = z.infer<
  typeof GetMerchantBookingAccepted
>;

export const GetMerchantBookingRejected = BookingModel.omit({
  bookingPrice: true,
  userId: true,
  addressId: true,
  merchantId: true,
});

export type TGetMerchantBookingRejected = z.infer<
  typeof GetMerchantBookingRejected
>;

export const GetMerchantBookingCanceled = GetMerchantBookingRejected;

export type TGetMerchantBookingCanceled = z.infer<
  typeof GetMerchantBookingCanceled
>;

export const GetMerchantBookingInProgress = GetMerchantBookingAccepted;

export type TGetMerchantBookingInProgress = z.infer<
  typeof GetMerchantBookingInProgress
>;

export const GetMerchantBookingDone = GetMerchantBookingAccepted.extend({
  review: z.any(),
});

export type TGetMerchantBookingDone = z.infer<typeof GetMerchantBookingDone>;

export const AcceptBookingSchema = z.object({
  bookingPrice: z
    .number({
      required_error: "estimation price can not be empty",
    })
    .min(20000, "estimation price can be between 20000 and 100000000")
    .max(100000000, "estimation price can be between 20000 and 100000000"),
});

export type TAcceptBookingSchema = z.infer<typeof AcceptBookingSchema>;

export const RejectBookingSchema = z.object({
  bookingReason: z
    .string({
      required_error: "reason for rejecting can not be empty",
    })
    .min(8, "reason for rejecting can be between 8 and 256 characters")
    .max(256, "reason for rejecting can be between 8 and 256 characters"),
});

export type TRejectBookingSchema = z.infer<typeof RejectBookingSchema>;
