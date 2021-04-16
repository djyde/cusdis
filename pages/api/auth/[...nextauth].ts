import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { prisma, singletonSync } from "../../../utils.server";
import { authProviders } from "../../../config.server";

const options = {
  // Configure one or more authentication providers
  providers: authProviders,

  adapter: Adapters.Prisma.Adapter({ prisma: prisma }),

  callbacks: {
    session: async (session, user) => {
      session.uid = user.id
      return Promise.resolve(session)
    }
  }
};

export default (req, res) => NextAuth(req, res, options);
