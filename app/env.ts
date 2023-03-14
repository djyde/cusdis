import 'server-only'

export const env = {
  isHosted: process.env.IS_HOSTED === 'true',
  host: process.env.HOST || 'https://cusdis.com'
}