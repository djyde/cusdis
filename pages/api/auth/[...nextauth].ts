import Adapters from "next-auth/adapters";
import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import Providers from "next-auth/providers";
import { prisma, resolvedConfig } from "../../../utils.server";

const providers = [] as any[]

if (resolvedConfig.useGithub) {
  providers.push(
    Providers.GitHub({
      clientId: resolvedConfig.oauthToken.github.clientId,
      clientSecret: resolvedConfig.oauthToken.github.clientSecret,
    })
  );
}

export const authOptions = {
  // Configure one or more authentication providers
  providers,
  adapter: Adapters.Prisma.Adapter({
    prisma
  })
};

export default NextAuth(authOptions);
