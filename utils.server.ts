import { PrismaClient } from '@prisma/client'
import { UserSession } from './service'
import { getSession as nextAuthGetSession } from 'next-auth/client'
import * as Sentry from '@sentry/node'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Boom from '@hapi/boom'

type EnvVariable = string | undefined
export const resolvedConfig = {
  useLocalAuth: process.env.USERNAME && process.env.PASSWORD,
  useGithub: process.env.GITHUB_ID && process.env.GITHUB_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  isHosted: process.env.IS_HOSTED === 'true',
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
    port: Number((process.env.SMTP_PORT as EnvVariable) || '587'),
    secure: Boolean((process.env.SMTP_SECURE as EnvVariable) || 'true'),
    auth: {
      user: process.env.SMTP_USER as EnvVariable,
      pass: process.env.SMTP_PASSWORD as EnvVariable,
    },
    senderAddress:
      (process.env.SMTP_SENDER as EnvVariable) ||
      'Cusdis Notification<notification@cusdis.com>',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY as EnvVariable,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN as EnvVariable,
  },
  minicapture: {
    apiKey: process.env.MINICAPTURE_API_KEY as EnvVariable,
  },
}

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

export const sentry = singletonSync('sentry', () => {
  if (resolvedConfig.sentry.dsn) {
    Sentry.init({
      dsn: resolvedConfig.sentry.dsn,
      tracesSampleRate: 1.0,
    })
    return Sentry
  }
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

export const HTTPException = Boom
export const apiHandler = () => {
  return nc<NextApiRequest, NextApiResponse>({
    onError(e, req, res, next) {
      if (Boom.isBoom(e)) {
        res.status(e.output.payload.statusCode)
        res.json({
          error: e.output.payload.error,
          message: e.output.payload.message,
        })
      } else {
        res.status(500)
        res.json({
          message: 'Unexpected error',
        })
        console.error(e)
        // unexcepted error
      }
    },
  })
}

export const getSession = async (req) => {
  return (await nextAuthGetSession({ req })) as UserSession
}
