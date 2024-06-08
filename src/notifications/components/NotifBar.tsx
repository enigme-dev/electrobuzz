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

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  authEndpoint: "/api/notification/auth",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

export default function NotifBar() {
  const [notifications, setNotifications] = useState<TNotificationSchema[]>([]);
  const [counter, setCounter] = useState(0);

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
        if (counter < 99) {
          setCounter((prev) => prev + 1);
        }
      });

      return () => {
        pusher.unsubscribe(privateChannel);
      };
    }
  }, [status]);

  return (
    <Popover>
      <PopoverTrigger asChild onClick={() => setCounter(0)}>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {counter > 0 && (
            <span className="bg-red-500 w-4 h-4 flex justify-center items-center rounded-full absolute top-[10%] right-[15%] text-[0.6rem] font-semibold text-white">
              <span>{counter}</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="md:w-[360px] w-full p-0">
        <div className="p-3 border-b">
          <span className="text-lg">Notifikasi</span>
        </div>
        <ul className="h-[480px] overflow-auto">
          {notifications.map((notif) => (
            <NotifCard key={notif.id} data={notif} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
