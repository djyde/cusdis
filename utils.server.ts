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

type EnvVariable = string | undefined

export const resolvedConfig = {
  useLocalAuth: process.env.USERNAME && process.env.PASSWORD,
  useGithub: process.env.GITHUB_ID && process.env.GITHUB_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  host: process.env.HOST || 'https://cusdis.com',
  umami: {
    id: process.env.UMAMI_ID as EnvVariable,
    src: process.env.UMAMI_SRC as EnvVariable,
  },
  google: {
    id: process.env.GOOGLE_ID as EnvVariable,
    secret: process.env.GOOGLE_SECRET as EnvVariable,
  },
  smtp: {
    host: process.env.SMTP_HOST as EnvVariable,
    port: Number(process.env.SMTP_PORT as EnvVariable || '587'),
    secure: Boolean(process.env.SMTP_SECURE as EnvVariable || 'true'),
    auth: {
      user: process.env.SMTP_USER as EnvVariable,
      pass: process.env.SMTP_PASSWORD as EnvVariable
    },
    senderAddress: process.env.SMTP_SENDER as EnvVariable
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY as EnvVariable
  }
}

export const getSession = async (req) => {
  return (await nextAuthGetSession({ req })) as UserSession
}
