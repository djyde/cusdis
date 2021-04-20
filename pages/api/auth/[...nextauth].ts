import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { prisma, resolvedConfig, singletonSync } from "../../../utils.server";
import { authProviders } from "../../../config.server";

const options = {
  // Configure one or more authentication providers
  providers: authProviders,

  adapter: Adapters.Prisma.Adapter({ prisma: prisma }),

  session: {
    jwt: !!resolvedConfig.useLocalAuth,
  },

  jwt: {
    secret: resolvedConfig.jwtSecret
  },

  callbacks: {
    session: async (session, user) => {
      session.uid = user.id;
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
