import PostHog from 'posthog-node'
import { RequestScopeService, UserSession } from '.'
import { resolvedConfig, sentry } from '../utils.server'

export class StatService {
  private client = resolvedConfig.posthog.apiKey
    ? new PostHog(resolvedConfig.posthog.apiKey, {
        host: 'https://app.posthog.com',
      })
    : null

  async capture(
    event: string,
    options?: {
      properties: any
      user?: UserSession
    },
  ) {
    if (this.client) {
      this.client.capture({
        distinctId: options?.user?.uid || 'unknown',
        event,
        properties: options?.properties,
      })
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
