import { z } from "zod";

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
