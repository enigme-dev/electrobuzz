"use client";

import { Input } from "@/core/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user?.isNewUser)
    return (
      <div className="wrapper py-4">
        <h1 className="font-bold text-lg pt-10">New User Form</h1>
        <div>
          <h1 className="font-semibold text-m pt-10">Username</h1>
          <div className="flex pt-5 w-full gap-52">
            <div className="text-md">
              <p>First Name</p>
              <Input placeholder="insert you first name" />
            </div>
            <div className="text-md">
              <p>Last Name</p>
              <Input placeholder="insert you Last name" />
            </div>
          </div>
        </div>
      </div>
    );

  return router.push("/");
}
