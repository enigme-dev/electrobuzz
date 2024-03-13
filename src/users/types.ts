import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string({ required_error: "name cannot be empty" })
    .min(3, "name must be between 3 and 128 characters")
    .max(128, "name must be between 3 and 128 characters"),
  phone: z
    .string({ required_error: "phone cannot be empty" })
    .regex(/^\d{10,14}$/, "phone must consist of 10-14 digits number"),
  phoneVerified: z.boolean().optional(),
  image: z.string({ required_error: "image cannot be empty" }),
});

export type UpdateProfileModel = z.infer<typeof UpdateProfileSchema>;