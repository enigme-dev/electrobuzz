import { signOut, useSession } from "next-auth/react";
import AuthDialog from "./auth-dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, NotepadText } from "lucide-react";
import { useState } from "react";

export const navList = [
  {
    label: "Dashboard",
    link: "/",
    icon: <HomeIcon size="20" />,
  },
  {
    label: "Bookings",
    link: "/bookings",
    icon: <NotepadText size="20" />,
  },
];

export default function AuthBar() {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(true);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
  };

  if (status === "loading" && pathname == "/") {
    return <div className="wrapper pt-60"></div>;
  }
  return (
    <>
      {session?.user ? (
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
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
                        className="text-xs px-3 py-2 text-white bg-green-500 hover:text-white hover:bg-green-500 cursor-default"
                      >
                        Verified
                      </Button>
                    ) : (
                      <Link href="/register">
                        <Button
                          variant="outline"
                          className="text-xs px-3 py-2 text-gray-600 outline-none"
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
                      <Link href="/bookings">Register as merchant</Link>
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
          <Button>Sign in</Button>
        </AuthDialog>
      )}
    </>
  );
}
