"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (session?.user?.isNewUser) return <h1>new user</h1>;

  return <h1>registered</h1>;
}
