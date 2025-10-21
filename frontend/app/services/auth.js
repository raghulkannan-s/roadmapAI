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
            limit: 3,
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to save user to backend:",
              await response.text()
            );
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, account, trigger }) {
      if (account?.providerAccountId) {
        token.provider_id = account.providerAccountId;
      }

      if (token.provider_id && (trigger === "signIn" || trigger === "update")) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${token.provider_id}`
          );
          if (response.ok) {
            const userData = await response.json();
            token.limit = userData.limit;
          }
        } catch (error) {
          console.error("Error fetching user limit:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.provider_id) {
        session.user.provider_id = token.provider_id;
      }
      if (token.limit !== undefined) {
        session.user.limit = token.limit;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});