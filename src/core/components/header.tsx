"use client";

import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toggleTheme } from "@/core/lib/shadcn";
import Link from "next/link";
import AuthBar from "./auth-bar";

export default function Header() {
  const { setTheme, theme } = useTheme();

  const handleToggleTheme = () => {
    const selectedTheme = toggleTheme(theme);
    setTheme(selectedTheme);
  };

  return (
    <div className="w-full p-3 border-b border-solid border-b-[#cecece] dark:border-b-[#383838]">
      <div className="wrapper flex justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/" className="select-none">
            <h1 className="font-bold text-xl">electroBu⚡z</h1>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link href="/merchant-list">
            <Button variant="default">Cari Jasa Favoritmu</Button>
          </Link>
          <AuthBar />
          <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
            <SunMoon className="mx-2 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
