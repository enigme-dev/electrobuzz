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
  phoneVerified: z.boolean().optional(),
});

export type UpdateProfileModel = z.infer<typeof UpdateProfileSchema>;

export const VerifyStatuses = z.enum([
  "correct",
  "incorrect",
  "expired",
  "not_found",
  "error",
]);

export type VerifyStatuses = z.infer<typeof VerifyStatuses>;

export const VerifyOTPSchema = z.object({
  verifId: z.string({ required_error: "verifId cannot be empty" }),
  code: z
    .string({ required_error: "Kode tidak boleh kosong" })
    .regex(/^\d{6}$/, "code must consist of 6-digits number"),
});

export type TVerifyOTPSchema = z.infer<typeof VerifyOTPSchema>;

export const AddressSchema = z.object({
  addressId: z.string().cuid().optional(),
  addressDetail: z
    .string({ required_error: "address detail cannot be empty" })
    .min(3, "detail must be between 3 and 128 characters")
    .max(128, "detail must be between 3 and 128 characters"),
  addressZipCode: z
    .string({ required_error: "zip code cannot be empty" })
    .regex(/^\d{5}$/, "zip code must consist of 5-digits number"),
  addressCity: z
    .string({ required_error: "city name cannot be empty" })
    .min(3, "city name must be between 3 and 128 characters")
    .max(128, "city name must be between 3 and 128 characters"),
  addressProvince: z
    .string({ required_error: "province name cannot be empty" })
    .min(3, "province name must be between 3 and 128 characters")
    .max(128, "province name must be between 3 and 128 characters"),
  userId: z.string().cuid().optional(),
});
export type AddressModel = z.infer<typeof AddressSchema>;
