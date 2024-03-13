import { z } from "zod";

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
