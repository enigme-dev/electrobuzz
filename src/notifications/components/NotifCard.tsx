import dayjs from "dayjs";
import { NotificationLevel, TNotificationSchema } from "../types";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotifCard({ data }: { data: TNotificationSchema }) {
  switch (data.level) {
    case NotificationLevel.Enum.success:
      return (
        <li className="grid">
          <span className="flex justify-between">
            <span>{data.service}</span>
            <span>{dayjs(data.createdAt).fromNow()}</span>
          </span>
          <span>{data.title}</span>
        </li>
      );
    case NotificationLevel.Enum.info:
      return (
        <li className="grid">
          <span className="flex justify-between">
            <span>{data.service}</span>
            <span>{dayjs(data.createdAt).fromNow()}</span>
          </span>
          <span>{data.title}</span>
        </li>
      );
    case NotificationLevel.Enum.warn:
      return (
        <li className="grid">
          <span className="flex justify-between">
            <span>{data.service}</span>
            <span>{dayjs(data.createdAt).fromNow()}</span>
          </span>
          <span>{data.title}</span>
        </li>
      );
    case NotificationLevel.Enum.error:
      return (
        <li className="grid">
          <span className="flex justify-between">
            <span>{data.service}</span>
            <span>{dayjs(data.createdAt).fromNow()}</span>
          </span>
          <span>{data.title}</span>
        </li>
      );
  }
}
