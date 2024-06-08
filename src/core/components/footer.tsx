"use client";

import { Button } from "@/core/components/ui/button";
import {
  AlignCenter,
  AlignLeft,
  Home,
  NotepadText,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toggleTheme } from "@/core/lib/shadcn";
import Link from "next/link";
import { AuthBar } from "./auth-bar";
import { usePathname } from "next/navigation";
import { SheetSide } from "./sheetBottom";

export default function Footer() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  const handleToggleTheme = () => {
    const selectedTheme = toggleTheme(theme);
    setTheme(selectedTheme);
  };

  const footerNavLink = [
    {
      icon: <Home strokeWidth={2} size={20} />,
      link: "/",
      title: "Home",
    },
    {
      icon: <NotepadText strokeWidth={2} size={20} />,
      link: "/user/my-bookings",
      title: "MyBookings",
    },
    {
      icon: <Search strokeWidth={2} size={20} />,
      link: "/merchant/search",
      title: "Search",
    },
  ];

  return (
    <div className="w-full p-3 border-t border-solid border-t-[#cecece] bg-white dark:border-t-[#383838] dark:bg-slate-950 z-50 sm:hidden">
      <div className="wrapper flex justify-around items-center ">
        {footerNavLink.map((value, index) => (
          <div key={index}>
            <Link href={value.link} className="select-none">
              <Button
                variant={"link"}
                className="grid items-center place-items-center gap-1 p-0 hover:no-underline text-black dark:text-white"
              >
                {value.icon}
                <p className="text-[0.6rem]">{value.title}</p>
              </Button>
            </Link>
          </div>
        ))}
        <div className="flex">
          <AuthBar />
        </div>
      </div>
    </div>
  );
}
