import { signOut, useSession } from "next-auth/react";
import AuthDialog from "./auth-dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  NotepadText,
  PersonStanding,
  Settings,
  User,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export const navList = [
  {
    label: "Dashboard",
    link: "/",
    icon: <HomeIcon size="20" />,
  },
  {
    label: "My Bookings",
    link: "/my-bookings",
    icon: <NotepadText size="20" />,
  },
  {
    label: "Edit Profile",
    link: "/",
    icon: <Settings size="20" />,
  },
];

export default function AuthBar() {
  const { data: session } = useSession();
  const [isVerified, setIsVerified] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

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
                    className="w-full"
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
                  <div>
                    {isVerified ? (
                      <Button
                        variant="outline"
                        className="text-xs px-2 rounded-full text-white bg-green-500 hover:text-white hover:bg-green-500 cursor-default"
                      >
                        Verified
                      </Button>
                    ) : (
                      <Link href="/register">
                        <Button
                          variant="outline"
                          className="text-xs px-2 py-1 rounded-full text-gray-600 outline-none"
                        >
                          Verify now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                {navList.map((value, index) => (
                  <div key={index} className="grid gap-2 text-start">
                    <Link className="flex gap-4 pt-2" href={value.link}>
                      <Button
                        variant="ghost"
                        className="w-full flex justify-start gap-5"
                      >
                        <span>{value.icon}</span>
                        <span>{value.label}</span>
                      </Button>
                    </Link>
                  </div>
                ))}
                <ul className="flex justify-between">
                  <li className="pt-5 text-center">
                    <Button variant="outline">
                      <Link href="/register-user-as-merchant">
                        Register as merchant
                      </Link>
                    </Button>
                  </li>
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
        <AuthDialog>
          <div>
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
          </div>
        </AuthDialog>
      )}
    </>
  );
}
