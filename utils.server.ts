import 'server-only'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

type EnvVariable = string | undefined;

export const resolvedConfig = {
  useLocalAuth: process.env.USERNAME && process.env.PASSWORD,
  useGithub: process.env.GITHUB_ID && process.env.GITHUB_SECRET,
  useGitlab: process.env.GITLAB_ID && process.env.GITLAB_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  isHosted: process.env.IS_HOSTED === "true",
  oauthToken: {
    github: {
      clientId: process.env.GITHUB_ID as EnvVariable,
      clientSecret: process.env.GITHUB_SECRET as EnvVariable,
    }
  },
  host: process.env.HOST || "https://cusdis.com",
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
    port: Number((process.env.SMTP_PORT as EnvVariable) || "587"),
    secure: Boolean((process.env.SMTP_SECURE as EnvVariable) || "true"),
    auth: {
      user: process.env.SMTP_USER as EnvVariable,
      pass: process.env.SMTP_PASSWORD as EnvVariable,
    },
    senderAddress:
      (process.env.SMTP_SENDER as EnvVariable) ||
      "Cusdis Notification<notification@cusdis.com>",
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
};


const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePath: parseUrl(process.env.NEXTAUTH_URL).basePath,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL
  ).baseUrl,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL
  ).basePath,
  keepAlive: 0,
  clientMaxAge: 0,
  // Properties starting with _ are used for tracking internal app state
  _clientLastSync: 0,
  _clientSyncTimer: null,
  _eventListenersAdded: false,
  _clientSession: undefined,
  _getSession: () => {},
};
function _apiBaseUrl() {
  if (typeof window === "undefined") {
    // NEXTAUTH_URL should always be set explicitly to support server side calls - log warning if not set
    if (!process.env.NEXTAUTH_URL) {
    }

    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`;
  }
  // Return relative path when called client side
  return __NEXTAUTH.basePath;
}
export const getSession = () => {
}