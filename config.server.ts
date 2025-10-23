import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GitLabProvider from 'next-auth/providers/gitlab'
import GoogleProvider from 'next-auth/providers/google'
import { prisma, resolvedConfig } from './utils.server'
import type { AuthOptions } from 'next-auth'

/**
 * Auth Providers
 * https://next-auth.js.org/configuration/providers
 */

const providers: AuthOptions['providers'] = []

if (resolvedConfig.useLocalAuth) {
  providers.push(
    CredentialsProvider({
      name: 'Username',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'env: USERNAME',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'env: PASSWORD',
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        
        if (
          credentials.username === process.env.USERNAME &&
          credentials.password === process.env.PASSWORD
        ) {
          const user = await prisma.user.upsert({
            where: {
              id: credentials.username,
            },
            create: {
              id: credentials.username,
              name: credentials.username,
            },
            update: {
              id: credentials.username,
              name: credentials.username,
            },
          })
          return user
        } else {
          return null
        }
      },
    }),
  )
}

if (resolvedConfig.useGithub) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  )
}

if (resolvedConfig.useGitlab) {
  providers.push(
    GitLabProvider({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
    })
  )
}

if (resolvedConfig.google.id) {
  providers.push(
    GoogleProvider({
      clientId: resolvedConfig.google.id!,
      clientSecret: resolvedConfig.google.secret!,
    }),
  )
}
export const authProviders = providers
