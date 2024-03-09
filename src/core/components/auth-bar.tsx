import { signOut, useSession } from "next-auth/react";
import AuthDialog from "./auth-dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

export default function AuthBar() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      {session?.user ? (
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="w-9 h-9">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end">
              <ul>
                <li>
                  <h2>{session.user.name}</h2>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-700/30"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </Button>
                </li>
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
