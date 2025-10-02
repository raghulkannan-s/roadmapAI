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
            provider_id: user.id,
          };

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            console.error("Failed to save user to backend:", await response.text());
          }
          console.log("User successfully saved to backend");
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});