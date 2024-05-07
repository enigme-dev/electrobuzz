import { z } from "zod";

export const BookStatusEnum = z.enum([
  "accepted",
  "canceled",
  "pending",
  "done",
]);

export type BookStatusEnum = z.infer<typeof BookStatusEnum>;

export const BookingModel = z.object({
  bookingId: z.string().cuid().optional(),
  bookingPhotoUrl: z.string(),
  bookingComplain: z.string(),
  bookingSchedule: z.string().datetime(),
  bookingStatus: BookStatusEnum.optional(),
  bookingReason: z.string().optional(),
  bookingPrice: z.number().optional(),
  bookingCreatedAt: z.date().optional(),
  addressId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  merchantId: z.string().cuid().optional(),
});

export type BookingModel = z.infer<typeof BookingModel>;
