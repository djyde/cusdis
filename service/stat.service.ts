import { resolvedConfig, sentry } from '../utils.server'
import { MiniCapture } from 'mini-capture'
export class StatService {
  private client = resolvedConfig.minicapture.apiKey
    ? new MiniCapture(resolvedConfig.minicapture.apiKey)
    : null

  async capture(
    event: string,
    options?: {
      identity?: string
      properties: any
    },
  ) {
    if (this.client) {
      try {
        this.client.capture(event, {
          identity: options?.identity,
          properties: options?.properties || {},
        })
      } catch (e) {
        console.error(e)
        // TODO: log error
      }
    } else {
      return null
    }
  }

  start(
    op: string,
    name: string,
    options?: {
      description?: string
      tags?: Record<string, string>
    },
  ) {
    if (sentry) {
      const transaction = sentry.startTransaction({
        op,
        name,
        tags: options?.tags,
        description: options?.description,
      })
      return {
        end() {
          transaction.finish()
        },
      }
    } else {
      return {
        end() {},
      }
    }
  }
}

export const statService = new StatService()
