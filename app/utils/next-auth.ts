import 'server-only'

import { cookies } from "next/headers"

const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePath: parseUrl(process.env.NEXTAUTH_URL).basePath,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL,
  ).baseUrl,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL,
  ).basePath,
  keepAlive: 0,
  clientMaxAge: 0,
  // Properties starting with _ are used for tracking internal app state
  _clientLastSync: 0,
  _clientSyncTimer: null,
  _eventListenersAdded: false,
  _clientSession: undefined,
  _getSession: () => {},
}

export default function parseUrl(url) {
  // Default values
  const defaultHost = 'http://localhost:3000'
  const defaultPath = '/api/auth'

  if (!url) {
    url = `${defaultHost}${defaultPath}`
  }

  // Default to HTTPS if no protocol explictly specified
  const protocol = url.startsWith('http:') ? 'http' : 'https'

  // Normalize URLs by stripping protocol and no trailing slash
  url = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Simple split based on first /
  const [_host, ..._path] = url.split('/')
  const baseUrl = _host ? `${protocol}://${_host}` : defaultHost
  const basePath = _path.length > 0 ? `/${_path.join('/')}` : defaultPath

  return { baseUrl, basePath }
}

function _apiBaseUrl() {
  if (typeof window === 'undefined') {
    // NEXTAUTH_URL should always be set explicitly to support server side calls - log warning if not set
    if (!process.env.NEXTAUTH_URL) {
      // logger.warn('NEXTAUTH_URL', 'NEXTAUTH_URL environment variable not set')
    }

    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`
  }
  // Return relative path when called client side
  return __NEXTAUTH.basePath
}

// @ts-expect-error
async function _fetchData(path, { ctx, req = ctx?.req } = {}) {
  try {
    const baseUrl = await _apiBaseUrl()
    const options = req ? { headers: { cookie: req.headers.cookie } } : {}
    const res = await fetch(`${baseUrl}/${path}`, options)
    const data = await res.json()
    if (!res.ok) throw data
    return Object.keys(data).length > 0 ? data : null // Return null if data empty
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const session = await _fetchData('session', {
    ctx: {
      req: {
        headers: {
          cookie: cookies().getAll().map(c => `${c.name}=${c.value}`).join(';'),
        },
      },
    },
  })
  return session
}
