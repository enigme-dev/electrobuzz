import { buildErr } from "@/core/lib/errors";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import Pusher from "pusher";
import { z } from "zod";

const PusherAuthSchema = z.object({
  socketId: z.string(),
  channelName: z.string(),
});

export async function POST(req: NextRequest) {
  let body;

  const token = await getToken({ req });

  try {
    body = await req.formData();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true,
  });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const input = PusherAuthSchema.safeParse({
    socketId: body.get("socket_id"),
    channelName: body.get("channel_name"),
  });
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  const allowedChannel = `private-${userId.data}`;
  if (input.data.channelName != allowedChannel) {
    return buildErr("ErrForbidden", 403);
  }

  const response = pusher.authorizeChannel(
    input.data.socketId,
    input.data.channelName
  );

  return Response.json(response);
}
