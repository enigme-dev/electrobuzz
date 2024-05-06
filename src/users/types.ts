import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string({ required_error: "name tidak boleh kosong" })
    .min(3, "nama harus diantara 3 dan 128 huruf")
    .max(128, "nama harus diantara 3 dan 128 huruf"),
  phone: z
    .string({ required_error: "Nomor telpon tidak boleh kosong" })
    .regex(/^\d{10,14}$/, "Nomor telpon harus 10-14 digit"),
  image: z.string({ required_error: "foto tidak boleh kosong" }).optional(),
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
