"use client";

import { Button } from "@/core/components/ui/button";
import { File, Folder, User } from "lucide-react";
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
];

const MerchantDashboardSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="lg:flex max-h-[calc(100vh-65px)] w-[30vh] hidden ">
      <div className="w-[30vh] p-10 ">
        <div className="flex flex-col items-center row-span-1 pb-16">
          <h1 className="text-2xl italic text-yellow-400 font-extrabold ">
            Merchant⚡
          </h1>
          <p className="text-lg font-semibold">Dashboard</p>
        </div>
        <div className="flex flex-col gap-5 w-full">
          {merchantDashboardNavList.map((value, index) => (
            <ul key={index}>
              <li className="w-44">
                <Link href={value.link}>
                  <Button
                    variant={"ghost"}
                    className={
                      pathname === value.link
                        ? "w-full flex gap-5 justify-start bg-accent"
                        : "w-full flex gap-5 justify-start"
                    }
                  >
                    <span>{value.icon}</span>
                    <p className="text-md max-w-fit">{value.title}</p>
                  </Button>
                </Link>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <div className="border-r-[1px] border-solid border-[#cecece] dark:border-[#383838]"></div>
    </div>
  );
};

export default MerchantDashboardSideBar;
