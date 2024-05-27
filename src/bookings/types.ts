import { MerchantModel } from "@/merchants/types";
import { AddressSchema, UserModel } from "@/users/types";
import { z } from "zod";

export const BookStatusEnum = z.enum([
  "expired", // booking expired
  "pending", // waiting for merchant
  "accepted", // merchant accepted
  "rejected", // merchant rejected
  "canceled", // user canceled
  "in_progress_requested", // service in progress requested by merchant
  "in_progress_accepted", // service in progress accepted by user
  "done", // user done
]);

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
  addressId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  merchantId: z.string().cuid().optional(),
});

export type TBookingModel = z.infer<typeof BookingModel>;

export const GetMerchantBookings = BookingModel.pick({
  bookingId: true,
  bookingSchedule: true,
  bookingStatus: true,
  bookingPriceMin: true,
  bookingPriceMax: true,
  bookingCreatedAt: true,
  bookingComplain: true,
  bookingPhotoUrl: true,
})
  .extend({
    bookingPriceMin: z.number().nullish(),
    bookingPriceMax: z.number().nullish(),
    user: z.object({ name: z.string(), image: z.string() }),
  })
  .array();

export type TGetMerchantBookings = z.infer<typeof GetMerchantBookings>;

export const GetMerchantBookingPending = BookingModel.omit({
  bookingPriceMin: true,
  bookingPriceMax: true,
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
  bookingPriceMin: z.number(),
  bookingPriceMax: z.number(),
  bookingDesc: z.string(),
});

export type TGetMerchantBookingAccepted = z.infer<
  typeof GetMerchantBookingAccepted
>;

export const GetMerchantBookingRejected = BookingModel.omit({
  bookingPriceMin: true,
  bookingPriceMax: true,
  userId: true,
  addressId: true,
  merchantId: true,
}).extend({ user: z.object({ name: z.string() }) });

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
  bookingPriceMin: z
    .number({
      required_error: "estimation price can not be empty",
    })
    .min(20000, "estimasi harga harus diantara 20000 sampai 10000000")
    .max(10000000, "estimasi harga harus diantara 20000 sampai 10000000"),
  bookingPriceMax: z
    .number({
      required_error: "estimasi harga tidak boleh kosong",
    })
    .min(20000, "estimasi harga harus diantara 20000 sampai 10000000")
    .max(10000000, "estimasi harga harus diantara 20000 sampai 10000000"),
  bookingDesc: z.string(),
});

export type TAcceptBookingSchema = z.infer<typeof AcceptBookingSchema>;

export const BookingReasonSchema = z.object({
  bookingReason: z
    .string({
      required_error: "alasan tidak boleh kosong",
    })
    .min(8, "alasan harus diantara 8 sampai 256 huruf")
    .max(256, "alasan harus diantara 8 sampai 256 huruf"),
});

export type TBookingReasonSchema = z.infer<typeof BookingReasonSchema>;

export const GetUserBooking = BookingModel.omit({
  userId: true,
  merchantId: true,
  addressId: true,
  bookingReason: true,
}).extend({
  bookingPriceMin: z.number().nullish(),
  bookingPriceMax: z.number().nullish(),
  bookingDesc: z.string().nullish(),
  address: AddressSchema,
  merchant: MerchantModel.pick({
    merchantId: true,
    merchantName: true,
    merchantPhotoUrl: true,
  }).extend({ user: z.object({ phone: z.string() }) }),
});

export type TGetUserBooking = z.infer<typeof GetUserBooking>;

export const GetUserBookingReason = GetUserBooking.extend({
  bookingReason: z.string(),
});

export type TGetUserBookingReason = z.infer<typeof GetUserBookingReason>;

export const GetUserBookingDone = GetUserBooking.extend({ review: z.any() });

export type TGetUserBookingDone = z.infer<typeof GetUserBookingDone>;

export const CreateBookingSchema = z.object({
  bookingPhotoUrl: z.string({ required_error: "foto tidak boleh kosong" }),
  bookingComplain: z.string({ required_error: "keluhan tidak boleh kosong" }),
  bookingSchedule: z
    .string({ required_error: "tanggal janji tidak boleh kosong" })
    .datetime("schedule must be a datetime string"),
  addressId: z
    .string({ required_error: "address id can not be empty" })
    .cuid("address id must be a cuid"),
});

export type TCreateBookingSchema = z.infer<typeof CreateBookingSchema>;
