import { BaseRepository } from "@/core/repositories/BaseRepository";
import { TCreateNotificationSchema } from "../types";
import { PER_PAGE, SearchParams } from "@/core/lib/utils";

export class NotificationRepository extends BaseRepository {
  static create(userId: string, data: TCreateNotificationSchema) {
    return this.db.notification.create({
      data: {
        notifService: data.service,
        notifTitle: data.title,
        notifLevel: data.level,
        notifMessage: data.message,
        notifPhotoUrl: data.photoUrl,
        notifActionUrl: data.actionUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  static findByUserId(userId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.notification.findMany({
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        orderBy: {
          notifCreatedAt: "desc",
        },
        where: {
          userId,
        },
      }),
      this.db.notification.count({ where: { userId } }),
    ]);
  }
}
