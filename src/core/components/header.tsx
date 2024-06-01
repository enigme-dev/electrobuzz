"use client";

import { Button } from "@/core/components/ui/button";
import { AlignJustify, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toggleTheme } from "@/core/lib/shadcn";
import Link from "next/link";
import { AuthBar } from "./auth-bar";
import { usePathname } from "next/navigation";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const handleToggleTheme = () => {
    const selectedTheme = toggleTheme(theme);
    setTheme(selectedTheme);
  };

  return (
    <div className="w-full p-3 border-b border-solid border-b-[#cecece] dark:border-b-[#383838] flex items-center sm:block">
      {pathname === "/merchant/dashboard/profile" && (
        <div className="sm:hidden">
          <AlignJustify />
        </div>
      )}
      <div className="wrapper flex justify-center sm:justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/" className="select-none">
            <h1 className="font-bold text-xl">electroBu⚡z</h1>
          </Link>
        </div>
        <div className="flex gap-2 ">
          <Link href="/merchant/search">
            <Button
              variant="link"
              className="text-black hover:text-yellow-400 hover:no-underline dark:text-white dark:hover:text-yellow-400 hidden sm:block"
            >
              Cari Teknisimu
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
            <SunMoon className="mx-2 h-6 w-6" />
          </Button>
          {/* <NotifBar /> */}
          <div className="hidden sm:block">
            <AuthBar />
          </div>
        </div>
      </div>
    </div>
  );
}
