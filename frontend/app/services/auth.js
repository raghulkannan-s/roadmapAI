import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            provider_id: account.providerAccountId,
          };

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            console.error("Failed to save user to backend:", await response.text());
          }
          console.log("User data sent to backend:", userData);
          console.log("User successfully saved to backend");
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true;
        }
      }
      return true;
    },

    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.provider_id = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.provider_id) {
        session.user.provider_id = token.provider_id;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});