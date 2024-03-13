import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/core/adapters/prisma";
import { PrismaClient } from "@prisma/client";

interface IUser extends DefaultUser {
  isNewUser?: boolean;
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
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger }) {
      const isNewUser = trigger === "signUp";
      if (isNewUser) {
        token.isNewUser = isNewUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.isNewUser = token.isNewUser;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + "/register";
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
