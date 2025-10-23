import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma, resolvedConfig } from "../../../../utils.server";
import { authProviders } from "../../../../config.server";
import { statService } from "../../../../service/stat.service";

// Using Module Augmentation
// https://next-auth.js.org/getting-started/typescript

declare module "next-auth" {
  interface Session {
    uid: string
  }
  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: authProviders,

  // Adapter is NOT compatible with Credentials provider (JWT sessions)
  // Only use adapter for OAuth/Email providers (database sessions)
  ...(!resolvedConfig.useLocalAuth && {
    adapter: PrismaAdapter(prisma),
  }),

  session: {
    strategy: !!resolvedConfig.useLocalAuth ? "jwt" : "database",
  },

  // Support both JWT_SECRET and NEXTAUTH_SECRET
  secret: resolvedConfig.jwtSecret || process.env.NEXTAUTH_SECRET,

  callbacks: {
    session({ session, user, token }) {
      if (user) {
        session.uid = user.id
      } else if (token) {
        session.uid = token.id as string
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    signIn() {
      statService.capture('signIn')
      return true
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

