import { z } from "zod";

const ErrTitleLength = "title must between 8 and 32 characters";
const ErrContentLength = "content must between 128 and 16384 characters";

export const CreatePostSchema = z.object({
  title: z
    .string({ required_error: "title can not be empty" })
    .min(8, ErrTitleLength)
    .max(32, ErrTitleLength),
  thumbnail: z.string().optional(),
  content: z
    .string({ required_error: "content can not be empty" })
    .min(128, ErrContentLength)
    .max(16384, ErrContentLength),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be boolean" })
    .optional(),
});

export type CreatePostModel = z.infer<typeof CreatePostSchema>;
