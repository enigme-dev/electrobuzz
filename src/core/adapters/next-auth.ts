import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/core/adapters/prisma";
import { generateUsername } from "@/core/lib/utils";

interface IUser extends DefaultUser {
  username?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.username = token.username;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      for (let i = 0; i < 10; i++) {
        try {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              username: generateUsername(user.name),
            },
          });
          return;
        } catch (e) {
          console.log(e);
        }
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: generateUsername(),
        },
      });
    },
  },
  session: {
    strategy: "jwt",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
