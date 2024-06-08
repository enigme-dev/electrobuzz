"use client";

import { Button } from "@/core/components/ui/button";
import { Folder, Star, User, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const merchantDashboardNavList = [
  {
    title: "Profil Mitra",
    link: "/merchant/dashboard/profile",
    icon: <User />,
  },
  {
    title: "Transaksi",
    link: "/merchant/dashboard/transaction",
    icon: <Folder />,
  },

  {
    title: "Rating",
    link: "/merchant/dashboard/rating",
    icon: <Star />,
  },
  {
    title: "Tagihan",
    link: "/merchant/dashboard/billing",
    icon: <Wallet />,
  },
];

const MerchantDashboardSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="lg:block hidden h-screen border-solid border-r border-[#cecece] dark:border-[#383838]">
      <div className="flex flex-col items-center row-span-1 p-10">
        <h1 className="text-2xl italic text-yellow-400 font-extrabold ">
          Merchant⚡
        </h1>
        <p className="text-lg font-semibold">Dashboard</p>
      </div>
      <nav className="p-4">
        <ul className="flex flex-col gap-5">
          {merchantDashboardNavList.map((value, index) => (
            <li key={index}>
              <Link href={value.link}>
                <Button
                  variant={"ghost"}
                  className={
                    pathname.startsWith(value.link)
                      ? "w-full flex gap-5 justify-start py-6 ripple  bg-yellow-400 text-black hover:bg-yellow-400 hover:text-black"
                      : "w-full flex gap-5 justify-start py-6 ripple text-gray-500 hover:bg-yellow-100 hover:text-black"
                  }
                >
                  <span>{value.icon}</span>
                  <p className="text-md max-w-fit">{value.title}</p>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MerchantDashboardSideBar;
