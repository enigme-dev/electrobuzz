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
import getPrivateProfile from "@/users/queries/getPrivateProfile";
import getAddressCount from "@/users/queries/getAddressCount";

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
    async jwt({ token }) {
      const profile = await getPrivateProfile(token.sub as string);
      const addressCt = await getAddressCount(token.sub as string);

      const isRegistered =
        Boolean(profile?.phone) && addressCt._count.addresses >= 1;

      if (!isRegistered) {
        token.isNewUser = true;
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
