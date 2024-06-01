import { z } from "zod";

export const ALBUM_QUOTA = 4;

export const IdentityStatuses = z.enum([
  "pending",
  "verified",
  "rejected",
  "suspended",
]);

export type TIdentityStatuses = z.infer<typeof IdentityStatuses>;

export const MerchantIdentitiesSchema = z.object({
  identityKTP: z.string(),
  identitySKCK: z.string(),
  identityDocs: z.string().optional(),
  identityStatus: IdentityStatuses.optional(),
  merchantId: z.string().optional(),
});

export type TMerchantIdentityModel = z.infer<typeof MerchantIdentitiesSchema>;

export const EditMerchantIdentitySchema = z.object({
  identityStatus: IdentityStatuses,
});

export type TEditMerchantIdentitySchema = z.infer<
  typeof EditMerchantIdentitySchema
>;

export const IdentitiesParam = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
});

export type TIdentitiesParam = z.infer<typeof IdentitiesParam>;

export const MerchantModel = z.object({
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
  merchantIdentity: MerchantIdentitiesSchema.optional(),
  userId: z.string().cuid().optional(),
});

export type TMerchantModel = z.infer<typeof MerchantModel>;

export const RegisterMerchantSchema = MerchantModel.extend({
  merchantIdentity: MerchantIdentitiesSchema,
});

export type TRegisterMerchantSchema = z.infer<typeof RegisterMerchantSchema>;

export const MerchantAlbumSchema = z.object({
  merchantAlbumId: z.string().cuid().optional(),
  albumPhotoUrl: z.string(),
  merchantId: z.string().cuid().optional(),
});

export type TMerchantAlbumSchema = z.infer<typeof MerchantAlbumSchema>;

export const AlbumsSchema = z.object({
  albums: MerchantAlbumSchema.array()
    .min(1, "album harus antara 1 sampai 4 foto")
    .max(4, "album harus antara 1 sampai 4 foto"),
});

export type TAlbumsSchema = z.infer<typeof AlbumsSchema>;

export const UpdateMerchantSchema = z
  .object({
    merchantName: z
      .string()
      .min(8, "name can be between 8 and 32 characters")
      .max(32, "name can be between 8 and 32 characters"),
    merchantPhotoUrl: z.string(),
    merchantDesc: z
      .string()
      .min(32, "description can be between 32 and 1200 characters")
      .max(1200, "description can be between 32 and 1200 characters"),
    merchantCity: z.string(),
    merchantProvince: z.string(),
    merchantLat: z.number(),
    merchantLong: z.number(),
    merchantCategory: z.string().array().min(1, "pick at least 1 category"),
    merchantAvailable: z.boolean(),
  })
  .partial();

export type TUpdateMerchantSchema = z.infer<typeof UpdateMerchantSchema>;

export const CreateIndexSchema = MerchantModel.pick({
  merchantId: true,
  merchantName: true,
  merchantPhotoUrl: true,
  merchantCity: true,
  merchantAvailable: true,
  merchantCategory: true,
  merchantLat: true,
  merchantLong: true,
  merchantRating: true,
  merchantReviewCt: true,
}).required();

export type TCreateIndexSchema = z.infer<typeof CreateIndexSchema>;

export const MerchantIndex = z.object({
  objectID: z.string().cuid(),
  merchantName: z.string(),
  merchantPhotoUrl: z.string(),
  merchantCity: z.string(),
  merchantAvailable: z.boolean(),
  _tags: z.string().array(),
  _geoloc: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type TMerchantIndex = z.infer<typeof MerchantIndex>;
