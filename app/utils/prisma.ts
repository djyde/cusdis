import 'server-only'

import { PrismaClient } from "@prisma/client"

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