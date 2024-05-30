import { Logger } from "@/core/lib/logger";
import {
  NotificationLevel,
  TCreateNotificationSchema,
  TNotificationSchema,
} from "../types";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { PusherClient } from "@/core/adapters/pusher";
import { SearchParams } from "@/core/lib/utils";

export async function createNotification(
  userId: string,
  input: TCreateNotificationSchema
) {
  try {
    if (input.message && input.message.length >= 64) {
      input.message = input.message.substring(0, 64) + "...";
    }
    const created = await NotificationRepository.create(userId, input);
    const pushNotif: TNotificationSchema = {
      id: created.notifId,
      service: created.notifService,
      title: created.notifTitle,
      level: NotificationLevel.parse(created.notifLevel),
      message: created.notifMessage ?? undefined,
      photoUrl: created.notifPhotoUrl ?? undefined,
      createdAt: created.notifCreatedAt.toString(),
    };
    PusherClient.trigger(`private-${userId}`, "notification", pushNotif);
  } catch (e) {
    Logger.error("notification", "create notif error", e);
  }
}

export async function getNotifications(
  userId: string,
  options?: SearchParams
): Promise<[TNotificationSchema[], number]> {
  const [notifications, notificationsCt] =
    await NotificationRepository.findByUserId(userId, options);

  const result: TNotificationSchema[] = notifications.map((notif) => ({
    id: notif.notifId,
    service: notif.notifService,
    title: notif.notifTitle,
    level: NotificationLevel.parse(notif.notifLevel),
    message: notif.notifMessage ?? undefined,
    photoUrl: notif.notifPhotoUrl ?? undefined,
    actionUrl: notif.notifActionUrl ?? undefined,
    createdAt: notif.notifCreatedAt.toString(),
  }));

  return [result, notificationsCt];
}
