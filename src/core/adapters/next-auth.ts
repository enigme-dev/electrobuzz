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
import { getPrivateProfile } from "@/users/services/UserService";
import { getMerchant } from "@/merchants/services/MerchantService";
import { getMerchantIdentity } from "@/merchants/services/MerchantIdentityService";

interface IUser extends DefaultUser {
  isAdmin?: boolean;
  isMerchant?: string;
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // check if user is admin
        const profile = await getPrivateProfile(user.id);
        token.isAdmin = profile?.isAdmin;

        // check if user is registered as merchant
        let merchant, merchantIdentity;
        try {
          merchant = await getMerchant(user.id);
          if (merchant) {
            merchantIdentity = await getMerchantIdentity(user.id);
          }
        } catch (e) {}
        token.isMerchant = merchantIdentity?.identityStatus || "unregistered";
      }

      if (trigger === "update") {
        if (session?.name) token.name = session.name;
        if (session?.image) token.picture = session.image;
        if (session?.isMerchant) token.isMerchant = session.isMerchant;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub ?? "";
        session.user.isAdmin = token.isAdmin;
        session.user.isMerchant = token.isMerchant;
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
