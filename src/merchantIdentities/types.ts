import { z } from "zod";

export const IdentityStatuses = z.enum(["pending", "verified", "rejected"]);
export type IdentityStatuses = z.infer<typeof IdentityStatuses>;

export const MerchantIdentitiesSchema = z.object({
  identityKTP: z.string(),
  identitySKCK: z.string(),
  identityDocs: z.string().optional(),
  identityStatus: IdentityStatuses.optional(),
  merchantId: z.string().optional(),
});

export type MerchantIdentitiesModel = z.infer<typeof MerchantIdentitiesSchema>;

export const EditMerchantIdentitySchema = z.object({
  identityStatus: IdentityStatuses,
});

export type EditMerchantIdentityModel = z.infer<
  typeof EditMerchantIdentitySchema
>;

export const IdentitiesParam = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
});

export type IdentitiesParam = z.infer<typeof IdentitiesParam>;
