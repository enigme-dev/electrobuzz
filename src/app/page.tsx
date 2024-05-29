"use client";

import { Banner } from "@/dashboard/banner";
import Category from "@/category/container/category";
import StepByStep from "@/step-by-step/container/stepBystep";
import NearestMerchants from "@/NearestMerchants/container/NearestMerchants";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import { TNotificationSchema } from "@/notifications/types";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  authEndpoint: "/api/pusher/user-auth",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

export default function Home() {
  const [notifications, setNotifications] = useState<TNotificationSchema[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      const privateChannel = `private-${session.user.id}`;
      const channel = pusher.subscribe(privateChannel);
      channel.bind("notification", (data: TNotificationSchema) => {
        console.log(data);
        setNotifications([...notifications, data]);
      });

      return () => {
        pusher.unsubscribe(privateChannel);
      };
    }
  }, [status]);

  return (
    <main className="px-4 pb-20 sm:py-16">
      <section className="wrapper flex justify-center">
        <Banner />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <StepByStep />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <Category />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <NearestMerchants />
      </section>
    </main>
  );
}
