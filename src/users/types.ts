import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string({ required_error: "name cannot be empty" })
    .min(3, "name must be between 3 and 128 characters")
    .max(128, "name must be between 3 and 128 characters"),
  phone: z
    .string({ required_error: "phone cannot be empty" })
    .regex(/^\d{10,14}$/, "phone must consist of 10-14 digits number"),
  image: z.string({ required_error: "image cannot be empty" }).optional(),
});

export type UpdateProfileModel = z.infer<typeof UpdateProfileSchema>;

export const VerifyStatuses = z.enum([
  "correct",
  "incorrect",
  "expired",
  "error",
]);

export type VerifyStatuses = z.infer<typeof VerifyStatuses>;

export const VerifyOTPSchema = z.object({
  verifId: z.string({ required_error: "verifId cannot be empty" }),
  code: z
    .string({ required_error: "code cannot be empty" })
    .regex(/^\d{6}$/, "code must consist of 6-digits number"),
});

export type VerifyOTPModel = z.infer<typeof VerifyOTPSchema>;
