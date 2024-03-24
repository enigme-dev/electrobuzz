import { z } from "zod";

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
