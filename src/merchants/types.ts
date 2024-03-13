import { z } from "zod";

export const MerchantModel = z.object({
  merchantId: z.string().cuid().optional(),
  merchantName: z.string(),
  merchantDesc: z.string(),
  merchantPhotoUrl: z.string(),
  merchantCity: z.string(),
  merchantProvince: z.string(),
  merchantCategory: z.string().array(),
  merchantRating: z.number().optional(),
  merchantReviewCt: z.number().int().optional(),
  merchantVerified: z.boolean().optional(),
  merchantAvailable: z.boolean().optional(),
  merchantCreatedAt: z.date().optional(),
  userId: z.string().cuid().optional(),
});

export type MerchantSchema = z.infer<typeof MerchantModel>;
