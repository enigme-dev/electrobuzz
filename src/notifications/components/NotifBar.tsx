"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { TNotificationSchema } from "../types";
import Pusher from "pusher-js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import axios from "axios";
import NotifCard from "./NotifCard";

export default function NotifBar() {
  const [notifications, setNotifications] = useState<TNotificationSchema[]>([]);
  const [showBadge, setShowBadge] = useState(false);

  const { data: session, status } = useSession();

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    authEndpoint: "/api/notification/auth",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  });

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      axios
        .get("/api/notification", { withCredentials: true })
        .then((res) => setNotifications(res.data.data))
        .catch((err) => console.error(err));

      const privateChannel = `private-${session.user.id}`;
      const channel = pusher.subscribe(privateChannel);
      channel.bind("notification", (data: TNotificationSchema) => {
        setNotifications((prev) => [data, ...prev]);
        setShowBadge(true);
      });

      return () => {
        pusher.unsubscribe(privateChannel);
      };
    }
  }, [status]);

  return (
    <Popover>
      <PopoverTrigger asChild onClick={() => setShowBadge(false)}>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {showBadge && (
            <span className="bg-red-500 w-2 h-2 rounded-full absolute top-[15%] right-[20%]"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] h-[480px] p-0">
        <div className="p-3 border-b">
          <span className="text-lg">Notifikasi</span>
        </div>
        <ul className="overflow-auto">
          {notifications.map((notif) => (
            <NotifCard key={notif.id} data={notif} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
