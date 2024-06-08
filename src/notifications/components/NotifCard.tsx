import dayjs from "dayjs";
import { TNotificationSchema } from "../types";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import NotifIcon from "./NotifIcon";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

export default function NotifCard({
  data,
  className,
}: Readonly<{
  data: TNotificationSchema;
  className?: string;
}>) {
  let target;
  const base = (
    <li
      className={twMerge(
        "flex gap-3 py-2 px-4 border-b hover:bg-gray-100",
        className
      )}
    >
      <div className="min-w-[48px] h-[48px]">
        {data.photoUrl ? (
          <Image
            src={data.photoUrl}
            className="w-[48px] h-[48px] object-cover rounded-md"
            width={48}
            height={48}
            alt={data.title}
          />
        ) : (
          <NotifIcon level={data.level} />
        )}
      </div>
      <div className="grid">
        <span className="text-[0.9375rem]">{data.title}</span>
        {data.message && (
          <span className="text-xs text-gray-700">{data.message}</span>
        )}
        <span className="text-xs text-gray-400">
          {dayjs(data.createdAt).fromNow()}
        </span>
      </div>
    </li>
  );

  if (data.actionUrl) {
    if (data.service === "booking/user") {
      target = "/user/my-bookings/" + data.actionUrl;
    } else if (data.service === "booking/merchant") {
      target = "/merchant/dashboard/transaction/" + data.actionUrl;
    }

    return <a href={target}>{base}</a>;
  }

  return base;
}
