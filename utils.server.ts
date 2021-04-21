import { PrismaClient } from '@prisma/client'
import { UserSession } from './service'
import { getSession as nextAuthGetSession } from 'next-auth/client'

export const singleton = async <T>(id: string, fn: () => Promise<T>) => {
  if (process.env.NODE_ENV === 'production') {
    return await fn()
  } else {
    if (!global[id]) {
      global[id] = await fn()
    }
    return global[id] as T
  }
}

export const singletonSync = <T>(id: string, fn: () => T) => {
  if (process.env.NODE_ENV === 'production') {
    return fn()
  } else {
    if (!global[id]) {
      global[id] = fn()
    }
    return global[id] as T
  }
}

export const prisma = singletonSync('prisma', () => {
  return new PrismaClient()
})

export function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export const resolvedConfig = {
  useLocalAuth: process.env.USERNAME && process.env.PASSWORD,
  useGithub: process.env.GITHUB_ID && process.env.GITHUB_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  umami: {
    id: process.env.UMAMI_ID as string | undefined,
    src: process.env.UMAMI_SRC as string | undefined,
  },
  google: {
    id: process.env.GOOGLE_ID as string | undefined,
    secret: process.env.GOOGLE_SECRET as string | undefined,
  },
}

export const getSession = async (req) => {
  return (await nextAuthGetSession({ req })) as UserSession
}
