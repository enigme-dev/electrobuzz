import { type NextRequest } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { buildErr } from "@/core/lib/errors";
import createPost from "@/posts/queries/create-post";
import { CreatePostSchema } from "@/posts/types";

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const inputPost = CreatePostSchema.safeParse(body);
  if (!inputPost.success) {
    return buildErr("ErrValidation", 400, inputPost.error);
  }

  try {
    const { postId, permalink } = await createPost(inputPost.data, userId.data);
    return Response.json({ post_id: postId, permalink: permalink });
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }
}
