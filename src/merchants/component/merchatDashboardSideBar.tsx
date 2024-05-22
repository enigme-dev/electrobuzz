"use client";

import { Button } from "@/core/components/ui/button";
import { File, Folder, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const merchantDashboardNavList = [
  {
    title: "Profile",
    link: "/merchant/dashboard/profile",
    icon: <User />,
  },
  {
    title: "Transactions",
    link: "/merchant/dashboard/transaction",
    icon: <Folder />,
  },
];

const MerchantDashboardSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="sm:flex h-[120vh] w-[30vh] hidden ">
      <div className="w-[30vh] grid-rows-2 place-items-start p-10 ">
        <div className="grid place-items-center row-span-1 pb-16">
          <h1 className="text-2xl italic text-yellow-400 font-extrabold ">
            Merchant⚡
          </h1>
          <p className="text-lg font-semibold">Dashboard</p>
        </div>
        <div className="grid place-items-center gap-5 max-w-40">
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
      <div className="border-r-[1px] border-solid border-[#cecece] dark:border-[#383838] h-"></div>
    </div>
  );
};

export default MerchantDashboardSideBar;
