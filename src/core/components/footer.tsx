"use client";

import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Home, NotepadText, Search, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toggleTheme } from "@/core/lib/shadcn";
import Link from "next/link";
import AuthBar from "./auth-bar";

export default function Footer() {
  const { setTheme, theme } = useTheme();

  const handleToggleTheme = () => {
    const selectedTheme = toggleTheme(theme);
    setTheme(selectedTheme);
  };

  return (
    <div className="w-full p-3 border-t border-solid border-t-[#cecece] dark:border-t-[#383838] bg-white dark:bg-[#020817] z-50">
      <div className="wrapper flex justify-around items-center ">
        <div>
          <Link href="/" className="select-none">
            <Button
              variant={"link"}
              className="grid items-center place-items-center gap-1 p-0 hover:no-underline text-black dark:text-white"
            >
              <Home strokeWidth={2} size={20} />
              <p className="text-[0.6rem]">Home</p>
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/my-bookings" className="select-none">
            <Button
              variant={"link"}
              className="grid items-center place-items-center gap-1 p-0 hover:no-underline text-black dark:text-white"
            >
              <NotepadText strokeWidth={2} size={20} />
              <p className="text-[0.6rem]">My Bookings</p>
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/merchant-list" className="select-none">
            <Button
              variant={"link"}
              className="grid items-center place-items-center gap-1 p-0 hover:no-underline text-black dark:text-white"
            >
              <Search strokeWidth={2} size={20} />
              <p className="text-[0.6rem]">Search</p>
            </Button>
          </Link>
        </div>
        <div className="flex">
          <AuthBar />
        </div>
      </div>
    </div>
  );
}