import { z } from "zod";

export const AddressSchema = z.object({
  addressId: z.string().cuid().optional(),
  addressDetail: z
    .string({ required_error: "address detail cannot be empty" })
    .min(3, "detail must be between 3 and 128 characters")
    .max(128, "detail must be between 3 and 128 characters"),
  addressZipCode: z
    .number({
      invalid_type_error: "zip code must be an integer",
      required_error: "zip code cannot be empty",
    })
    .int()
    .gte(10000, "zip code must be 5 digits")
    .lte(99999, "zip code must be 5 digits"),
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
