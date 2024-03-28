import { z } from "zod";

export const IdentityStatuses = z.enum(["pending", "verified", "rejected"]);
export type IdentityStatuses = z.infer<typeof IdentityStatuses>;

export const MerchantIdentitiesSchema = z.object({
  identityKtp: z.string(),
  identitySkck: z.string(),
  identityCert: z.string().optional(),
  identityStatus: IdentityStatuses.optional(),
  merchantId: z.string().optional(),
});

export type MerchantIdentitiesModel = z.infer<typeof MerchantIdentitiesSchema>;
