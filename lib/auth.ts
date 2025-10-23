import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma, resolvedConfig } from "../utils.server"
import { statService } from "../service/stat.service"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "postgresql" / "mysql"
  }),
  
  emailAndPassword: {
    enabled: !!resolvedConfig.useLocalAuth,
    async sendResetPassword({ user, url }) {
      // Email sending logic if needed
      console.log("Reset password URL:", url)
    }
  },
  
  socialProviders: {
    github: resolvedConfig.useGithub ? {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    } : undefined,
    
    gitlab: resolvedConfig.useGitlab ? {
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
    } : undefined,
    
    google: resolvedConfig.google.id ? {
      clientId: resolvedConfig.google.id!,
      clientSecret: resolvedConfig.google.secret!,
    } : undefined,
  },
  
  secret: resolvedConfig.jwtSecret || process.env.NEXTAUTH_SECRET,
  
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day (session will be updated if it's older than this)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },

  hooks: {
    after: [
      {
        matcher(context) {
          return context.path === "/sign-in/social" || context.path === "/sign-in/email"
        },
        handler: async (ctx) => {
          statService.capture('signIn')
        }
      }
    ]
  },
  
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "better-auth",
  }
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user


