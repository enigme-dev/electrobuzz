import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string({ required_error: "name cannot be empty" })
    .min(3, "name must be between 3 and 128 characters")
    .max(128, "name must be between 3 and 128 characters"),
  phone: z
    .string({ required_error: "phone cannot be empty" })
    .min(10, "phone must be between 10 and 14 characters")
    .max(14, "name must be between 10 and 14 characters"),
  image: z.string({ required_error: "image cannot be empty" }),
});

export type UpdateProfileModel = z.infer<typeof UpdateProfileSchema>;
