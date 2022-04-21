import { getCurrentUser } from "@/helpers/requests";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token) {
  try {
    const payload = {
      refresh_token: token.refreshToken,
    };

    console.log("Payload", { payload });

    const url = "http://localhost:8055/auth/refresh";
    const response = await fetch(url, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();
    console.log("Refresh", { refreshedTokens });

    return {
      ...token,
      accessToken: refreshedTokens.data.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.data.expires,
      refreshToken: refreshedTokens.data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log("error", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const payload = {
            email: credentials.email,
            password: credentials.password,
          };

          console.log("Payload", { payload });

          const res = await fetch("http://localhost:8055/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const user = await res.json();
          if (!res.ok) {
            if (user?.errors[0]?.extensions?.code === "INVALID_CREDENTIALS") {
              throw new Error("Неверный Email или пароль");
            }
            throw new Error(user?.errors[0]?.message);
          }
          if (user?.data?.access_token) {
            return user.data;
          }

          return null;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
        token.accessTokenExpires = Date.now() + user.expires;
        token.refreshToken = user.refresh_token;
      }

      const userData = await getCurrentUser(token.accessToken);
      console.log("NEXT_USER", { userData });
      token.email = userData.email;
      token.role = userData.role;
      token.groupId = userData.group;
      token.id = userData.id;

      const shouldRefreshTime = Math.round(
        token.accessTokenExpires - 5 * 60 * 1000 - Date.now()
      );

      console.log({ shouldRefreshTime });

      if (shouldRefreshTime > 0) {
        return Promise.resolve(token);
      }
      token = refreshAccessToken(token);
      return Promise.resolve(token);
    },

    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.expires = token.accessTokenExpires;
      session.user.groupId = token.groupId;
      session.user.id = token.id;
      session.error = token?.error;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default (req, res) => NextAuth(req, res, options);
