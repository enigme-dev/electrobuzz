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
import getMerchantByUserId from "@/merchants/queries/getMerchantByUserId";

interface IUser extends DefaultUser {
  isNewUser?: boolean;
  isAdmin?: boolean;
  merchantId?: string;
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
    async jwt({ token, user }) {
      if (user) {
        const profile = await getPrivateProfile(user.id);
        const addressCt = await getAddressCount(user.id);

        const isRegistered =
          Boolean(profile?.phone) && addressCt._count.addresses >= 1;
        if (!isRegistered) {
          token.isNewUser = true;
        }

        token.isAdmin = profile?.isAdmin;
        try {
          const merchant = await getMerchantByUserId(user.id);
          if (merchant) {
            token.merchantId = merchant.merchantId;
          }
        } catch (e) {}
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.isNewUser = token.isNewUser;
        session.user.merchantId = token.merchantId;
        session.user.isAdmin = token.isAdmin;
        session.user.id = token.sub || "";
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
