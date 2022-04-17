import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

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
    console.log({ refreshedTokens });
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
        const payload = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch("http://localhost:8055/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US",
          },
        });

        const user = await res.json();

        if (!res.ok) {
          throw new Error("Wrong username or password");
        }

        if (res.ok && user) {
          const parsed = parseJwt(user.data.access_token);
          const res2 = await fetch(`http://localhost:8055/users/${parsed.id}`);
          const currentUser = await res2.json();
          return { ...currentUser.data, ...user.data };
        }

        return null;
      },
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: "SUPER_SECRET_JWT_SECRET",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        console.log({ user });
        return {
          ...token,
          accessToken: user.access_token,
          accessTokenExpires: Date.now() + user.expires,
          refreshToken: user.refresh_token,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          group: user.group,
          id: user.id,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.group = token.group;
      session.user.id = token.id;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default (req, res) => NextAuth(req, res, options);
