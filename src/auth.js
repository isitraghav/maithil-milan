import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut, getSession } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token; // Capture the access_token
        token.profile = profile; // Store the profile information
        token.account = account; // Store the account information
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.profile = token.profile;
      session.account = token.account;

      session.user.id = token.id; // Store user ID if needed

      return session;
    },
  },
});
