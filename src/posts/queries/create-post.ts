import { CreatePostModel } from "@/posts/types";
import { generatePermalink } from "@/core/lib/utils";
import { prisma } from "@/core/adapters/prisma";

export default async function createPost(
  data: CreatePostModel,
  userId: string
) {
  const permalink = generatePermalink(data.title);

  const created = await prisma.post.create({
    select: {
      id: true,
    },
    data: {
      permalink: permalink,
      title: data.title,
      thumbnail: data.thumbnail,
      content: data.content,
      isPublished: data.isPublished,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return { postId: created.id, permalink: permalink };
}
