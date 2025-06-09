import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type UserToken = { id: string; name: string; email: string };

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "1234",
        },
      },
      async authorize(credentials, req) {
        return { id: "1", name: "Admin", email: "admin@example.com" };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
