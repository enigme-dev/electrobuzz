import { buildErr } from "@/core/lib/errors";
import { Logger } from "@/core/lib/logger";
import { buildRes, parseParams } from "@/core/lib/utils";
import { getNotifications } from "@/notifications/services/NotificationService";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { page, skip } = parseParams(searchParams);

  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    const [notifications, notificationsCt] = await getNotifications(
      userId.data,
      { page: skip }
    );
    return buildRes({ data: notifications, page, total: notificationsCt });
  } catch (e) {
    Logger.error("notification", "get user notif error", e);
    return buildErr("ErrUnknown", 500);
  }
}
