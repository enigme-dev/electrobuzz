import { PusherClient } from "@/core/adapters/pusher";
import { buildErr } from "@/core/lib/errors";
import { PusherAuthSchema } from "@/notifications/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  let body;

  const token = await getToken({ req });

  try {
    body = await req.formData();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

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

  const response = PusherClient.authorizeChannel(
    input.data.socketId,
    input.data.channelName
  );

  return Response.json(response);
}
