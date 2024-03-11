import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string(),
  phone: z.string(),
});

export type UpdateProfileModel = z.infer<typeof UpdateProfileSchema>;
