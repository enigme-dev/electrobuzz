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

export const MerchantSchema = z.object({
  merchantId: z.string().cuid().optional(),
  merchantName: z.string(),
  merchantDesc: z.string(),
  merchantPhotoUrl: z.string(),
  merchantCity: z.string(),
  merchantProvince: z.string(),
  merchantLat: z.number(),
  merchantLong: z.number(),
  merchantCategory: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Pilih satu kategori",
    }),
  merchantRating: z.number().optional(),
  merchantReviewCt: z.number().int().optional(),
  merchantVerified: z.boolean().optional(),
  merchantAvailable: z.boolean().optional(),
  merchantCreatedAt: z.date().optional(),
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

export const MerchantAlbumSchema = z.object({
  merchantAlbumId: z.string().cuid().optional(),
  albumPhotoUrl: z.string(),
  merchantId: z.string().cuid().optional(),
});

export type MerchantAlbumModel = z.infer<typeof MerchantAlbumSchema>;

export const AlbumsSchema = z.object({
  albums: MerchantAlbumSchema.array()
    .min(1, "album must between 1 to 4 photos")
    .max(4, "album must between 1 to 4 photos"),
});

export type AlbumsSchema = z.infer<typeof AlbumsSchema>;
