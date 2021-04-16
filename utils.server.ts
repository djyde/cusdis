import { PrismaClient } from "@prisma/client";

export const singleton = async <T>(id: string, fn: () => Promise<T>) => {
  if (process.env.NODE_ENV === "production") {
    return await fn()
  } else {
    if (!global[id]) {
      global[id] = await fn()
    }
    return global[id] as T;
  }
};

export const singletonSync = <T>(id: string, fn: () => T) => {
  if (process.env.NODE_ENV === "production") {
    return fn();
  } else {
    if (!global[id]) {
      global[id] = fn();
    }
    return global[id] as T;
  }
};

export const prisma = singletonSync("prisma", () => {
  return new PrismaClient();
});

export function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}