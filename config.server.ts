import { timingSafeEqual } from 'crypto'
import Providers, { AppProviders } from 'next-auth/providers'
import { prisma, resolvedConfig } from './utils.server'

/**
 * Auth Providers
 * https://next-auth.js.org/configuration/providers
 */

const providers: AppProviders = []

if (resolvedConfig.useLocalAuth) {
  providers.push(
    Providers.Credentials({
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
      async authorize(credentials: { username: string; password: string }) {
        if (
          credentials.username === process.env.USERNAME &&
          process.env.PASSWORD &&
          (() => { try { return timingSafeEqual(Buffer.from(credentials.password), Buffer.from(process.env.PASSWORD)) } catch { return false } })()
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
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user,user:email',
    }),
  )
}

if (resolvedConfig.useGitlab) {
  providers.push(
    Providers.GitLab({
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET,
    })
  )
}

if (resolvedConfig.google.id) {
  providers.push(
    Providers.Google({
      clientId: resolvedConfig.google.id,
      clientSecret: resolvedConfig.google.secret,
    }),
  )
}
export const authProviders = providers
