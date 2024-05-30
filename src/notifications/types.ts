import { z } from "zod";

export const PusherAuthSchema = z.object({
  socketId: z.string(),
  channelName: z.string(),
});

export type TPusherAuthSchema = z.infer<typeof PusherAuthSchema>;

export const NotificationLevel = z.enum(["success", "info", "warn", "error"]);

export type TNotificationLevel = z.infer<typeof NotificationLevel>;

export const NotificationSchema = z.object({
  service: z.string(),
  title: z.string(),
  level: NotificationLevel,
  message: z.string().optional(),
  photoUrl: z.string().url().optional(),
  actionTitle: z.string().optional(),
  actionUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
});

export type TNotificationSchema = z.infer<typeof NotificationSchema>;