import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [Google],
  jwt: {
    secret: process.env.JWT_SECRET, // Define a secure secret in your .env file
    maxAge: 30 * 24 * 60 * 60, // Optional: Token expiration (30 days in this example)
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Add Google account information to the token
      if (account?.provider === "google") {
        token.id = profile.id;
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach token data to the session
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
});

export async function isLoggedin() {
  const session = await auth();
  return !!session;
}
