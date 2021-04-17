import Providers from "next-auth/providers";

/**
 * Auth Providers
 * https://next-auth.js.org/configuration/providers
 */
export const authProviders = [
  Providers.GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    scope: "read:user,user:email",
  }),
];