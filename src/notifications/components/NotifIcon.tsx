import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { NotificationLevel, TNotificationLevel } from "../types";

export default function NotifIcon({ level }: { level: TNotificationLevel }) {
  switch (level) {
    case NotificationLevel.Enum.success:
      return <CircleCheck className="w-[48px] h-[48px] text-green-600" />;
    case NotificationLevel.Enum.warn:
      return <TriangleAlert className="w-[48px] h-[48px] text-yellow-500" />;
    case NotificationLevel.Enum.error:
      return <CircleX className="w-[48px] h-[48px] text-red-700" />;
    default:
      return <Info className="w-[48px] h-[48px] text-cyan-700" />;
  }
}
