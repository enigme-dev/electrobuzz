import { Logger } from "@/core/lib/logger";
import { TNotificationSchema } from "../types";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { PusherClient } from "@/core/adapters/pusher";
import { SearchParams } from "@/core/lib/utils";

export async function createNotification(
  userId: string,
  input: TNotificationSchema
) {
  try {
    const created = await NotificationRepository.create(userId, input);
    PusherClient.trigger(`private-${userId}`, "notification", created);
  } catch (e) {
    Logger.error("notification", "create notif error", e);
  }
}

export async function getNotifications(userId: string, options?: SearchParams) {
  return await NotificationRepository.findByUserId(userId, options);
}
