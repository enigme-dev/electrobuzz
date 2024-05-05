import { MerchantIdentitiesSchema } from "@/merchantIdentities/types";
import { z } from "zod";

export const MerchantSchema = z.object({
  merchantId: z.string().cuid().optional(),
  merchantName: z.string(),
  merchantDesc: z.string(),
  merchantPhotoUrl: z.string(),
  merchantCity: z.string(),
  merchantProvince: z.string(),
  merchantLat: z.number(),
  merchantLong: z.number(),
  merchantCategory: z.string().array(),
  merchantRating: z.number().nullable(),
  merchantReviewCt: z.number().int().nullable(),
  merchantVerified: z.boolean().nullable(),
  merchantAvailable: z.boolean().nullable(),
  merchantCreatedAt: z.date().nullable(),
  merchantIdentity: MerchantIdentitiesSchema.pick({
    identityStatus: true,
  }).optional(),
  userId: z.string().cuid().optional(),
});

export type MerchantModel = z.infer<typeof MerchantSchema>;

export const RegisterMerchantSchema = MerchantSchema.extend({
  merchantIdentity: MerchantIdentitiesSchema,
});

export type RegisterMerchantSchema = z.infer<typeof RegisterMerchantSchema>;
