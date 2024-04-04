import { signOut, useSession } from "next-auth/react";
import AuthDialog from "./auth-dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";

export const navList = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Bookings",
    link: "/bookings",
  },
  {
    label: "Data Verification",
    link: "/register",
  },
];

export default function AuthBar() {
  const { data: session, status } = useSession();

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
                <li>
                  <h2 className="text-sm">{session.user.name}</h2>
                </li>
                <li>
                  <h2 className="text-gray-400 text-sm">
                    {session.user.email}
                  </h2>
                </li>
                {navList.map((value, index) => (
                  <div key={index} className="grid gap-2 text-center">
                    <li className="pt-5 text-sm">
                      <Link href={value.link}>{value.label}</Link>
                    </li>
                    <Separator />
                  </div>
                ))}
                <ul className="flex gap-2">
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
