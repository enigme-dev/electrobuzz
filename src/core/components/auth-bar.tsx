import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import {
  HomeIcon,
  NotepadText,
  Settings,
  Star,
  User,
  UserRound,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TMerchantIdentityModel } from "@/merchants/types";

export function AuthBar() {
  const { data: session } = useSession();
  const handleSignOut = () => {
    signOut();
  };
  const {
    isLoading: getMerchantIdentitiesLoading,
    error: getMerchantIdentitiesError,
    data: getMerchantIdentities,
  } = useQuery({
    queryKey: ["getMerchantIdentity", session?.user?.id],
    queryFn: async () =>
      await axios.get(`/api/merchant/identity`).then((response) => {
        return response.data.data as TMerchantIdentityModel;
      }),
    enabled: !!session?.user?.id,
  });
  const isAdmin = session?.user?.isAdmin;
  const navList = [
    {
      label: "Profil",
      link: "/user/profile",
      icon: <User size="20" />,
      show: true,
    },
    {
      label: "Riwayat Pesanan",
      link: "/user/my-bookings",
      icon: <NotepadText size="20" />,
      show: true,
    },

    {
      label: "Halaman Admin",
      link: "/admin",
      icon: <Users size="20" />,
      show: isAdmin,
    },
    {
      label: "Ulasan",
      link: "/user/rating",
      icon: <Star size="20" />,
      show: true,
    },
  ];

  return (
    <>
      {session?.user ? (
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <div className="grid gap-1 items-center place-items-center">
                <Avatar className="w-9 h-9 grid">
                  <AvatarImage
                    src={session?.user?.image ?? undefined}
                    referrerPolicy="no-referrer"
                    className="object-cover object-center aspect-square"
                  />
                  <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit">
              <ul>
                <div className="flex gap-5">
                  <div>
                    <li>
                      <h2 className="text-sm">{session.user.name}</h2>
                    </li>
                    <li>
                      <h2 className="text-gray-400 text-sm">
                        {session.user.email}
                      </h2>
                    </li>
                  </div>
                </div>
                {navList.map((value, index) => (
                  <div key={index} className="grid gap-2 text-start">
                    {value.show && (
                      <Link className="flex gap-4 pt-2" href={value.link}>
                        <Button
                          variant="ghost"
                          className="w-full flex justify-start gap-5"
                        >
                          <span>{value.icon}</span>
                          <span>{value.label}</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
                <ul className="flex justify-between gap-5">
                  {getMerchantIdentities?.identityStatus != "unregistered" ? (
                    <li className="pt-5 text-center">
                      <Link href="/merchant/dashboard/profile">
                        <Button
                          variant="outline"
                          className="bg-yellow-400 hover:bg-yellow-300 dark:text-black text-black"
                        >
                          Halaman Mitra
                        </Button>
                      </Link>
                    </li>
                  ) : (
                    <li className="pt-5 text-center">
                      <Link href="/merchant/register">
                        <Button variant="outline">Daftar sebagai Mitra</Button>
                      </Link>
                    </li>
                  )}
                  <li className="pt-5 text-center">
                    <Button
                      variant="destructive"
                      className=" text-white hover:bg-red-600 "
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </li>
                </ul>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div>
          <Link href={"/login"}>
            <Button
              variant={"link"}
              className="grid gap-1 items-center place-items-center p-0 hover:no-underline dark:text-white sm:hidden text-black"
            >
              <UserRound strokeWidth={2} size={20} />
              <p className="text-[0.6rem]">Login</p>
            </Button>
            <Button
              variant={"secondary"}
              className="bg-yellow-400 hover:bg-yellow-300 hidden sm:block dark:text-black"
            >
              <p className="text-xs">Login</p>
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
