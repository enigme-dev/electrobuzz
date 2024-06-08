"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Folder, Star, User, Wallet } from "lucide-react";

interface SheetSideProps {
  buttonTrigger: any;
}

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
export function SheetSide({ buttonTrigger }: SheetSideProps) {
  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-transparent backdrop-blur-sm">
            {buttonTrigger}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Merchant Dashboard</SheetTitle>
          </SheetHeader>
          <nav className="p-4">
            <ul className="flex flex-col gap-5">
              {merchantDashboardNavList.map((value, index) => (
                <li key={index}>
                  <Link href={value.link}>
                    <Button
                      variant={"ghost"}
                      className="w-full flex gap-5 justify-start py-6"
                    >
                      <span>{value.icon}</span>
                      <p className="text-md max-w-fit">{value.title}</p>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
