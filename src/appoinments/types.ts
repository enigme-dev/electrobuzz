import { z } from "zod";

export const ApptStatusEnum = z.enum([
  "accepted",
  "canceled",
  "pending",
  "done",
]);

export const AppointmentsSchema = z.object({
  apptId: z.string().cuid().optional(),
  apptPhotoUrl: z.string(),
  apptComplain: z.string(),
  apptSchedule: z.date(),
  apptStatus: ApptStatusEnum,
  apptReason: z.string(),
  apptPrice: z.number(),
  apptCreatedAt: z.date(),
  userId: z.string().cuid().optional(),
});
