import NextAuth from "next-auth";
import Adapters from "next-auth/adapters";
import { prisma, resolvedConfig, singletonSync } from "../../../utils.server";
import { authProviders } from "../../../config.server";
import { statService } from "../../../service/stat.service";

// Using Module Augmentation
// https://next-auth.js.org/getting-started/typescript

declare module "next-auth" {
  interface Session {
    uid: string
  }
  interface User {
    id: string
    displayName?: string
    notificationEmail?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: authProviders,

  adapter: Adapters.Prisma.Adapter({ prisma: prisma }),

  session: {
    jwt: !!resolvedConfig.useLocalAuth,
  },

  jwt: {
    secret: resolvedConfig.jwtSecret,
  },

  callbacks: {
    async session(session, user) {
      const userInDb = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      })
      session.uid = user.id
      session.user.displayName = userInDb?.displayName
      session.user.notificationEmail = userInDb?.notificationEmail
      return session
    },
    jwt(token, user) {
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
  
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      }
    }
  },

  events: {
    async error(message) {
      console.log(message)
    },
  },
})
