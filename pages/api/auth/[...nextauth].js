import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token) {
  try {
    const payload = {
      refresh_token: token.refreshToken,
    };
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
    if (!response.ok) {
      throw refreshedTokens;
    }

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

async function getCurrentUser(accessToken) {
  try {
    const res = await fetch(
      `http://localhost:8055/users/me?fields=id,first_name,last_name,email,role,group.Group_id.name,group.Group_id.id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const currentUser = await res.json();
    return currentUser?.data;
  } catch (error) {
    throw new Error(error);
  }
}

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
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

          if (user.data.access_token) {
            return user.data;
          }
        } catch (error) {
          throw new Error(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.access_token,
          accessTokenExpires: Date.now() + user.expires,
          refreshToken: user.refresh_token,
        };
      }

      const shouldRefreshTime = Math.round(
        token.accessTokenExpires - 5 * 60 * 1000 - Date.now()
      );

      if (shouldRefreshTime > 0) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      const user = await getCurrentUser(token.accessToken);
      session.user.firstName = user.first_name;
      session.user.lastName = user.last_name;
      session.user.email = user.email;
      session.user.role = user.role;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.expires = token.accessTokenExpires;
      session.user.groupId = user.group[0].Group_id.id;
      session.user.groupName = user.group[0].Group_id.name;
      session.user.id = user.id;
      session.error = token?.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default (req, res) => NextAuth(req, res, options);
