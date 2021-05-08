import { AkismetClient } from 'akismet-api'
import { resolvedConfig } from '../utils.server'
import { CommentStatus } from './comment.service'

interface IAntiSpamService {
  checkSpam(comment: spamComment): Promise<CommentStatus>
}

type spamComment = {
  ip: string
  useragent: string
  content?: string
  email?: string
  name?: string
}

export enum AntiSpamMode {
  Auto = 'auto',
  HalfAuto = 'half-auto',
  Manual = 'manual',
}

export class AntiSpamService implements IAntiSpamService {
  private provider: IAntiSpamService = undefined
  private mode: AntiSpamMode

  constructor() {
    if (resolvedConfig.akismet.key) {
      const akismetService = new AkismetService(
        resolvedConfig.akismet.key,
        resolvedConfig.host,
      )
      akismetService.verifyKey().catch(err => {
        throw err
      })
      this.provider = akismetService
      this.mode = <AntiSpamMode>resolvedConfig.antispamMode
    }
  }

  async checkSpam(comment: spamComment): Promise<CommentStatus> {
    // by manual
    if (this.mode === AntiSpamMode.Manual) {
      return CommentStatus.Pending
    }

    let status: CommentStatus = await this.provider.checkSpam(comment)

    // by auto
    if (this.mode === AntiSpamMode.Auto) {
      return status
    }

    // by half-auto
    return status === CommentStatus.Spam ? CommentStatus.Pending : CommentStatus.Approved
  }
}

class AkismetService implements IAntiSpamService {
  private client: AkismetClient

  constructor(key: String, url: String) {
    this.client = new AkismetClient({ key, blog: url })
  }

  async verifyKey(): Promise<Boolean> {
    try {
      const isValid = await this.client.verifyKey()
      return isValid
    } catch (err) {
      throw Error('Cound not reach Akismet: ' + err.message)
    }
  }
  async checkSpam(comment: spamComment): Promise<CommentStatus> {
    try {
      const isSpam = await this.client.checkSpam(comment)
      return isSpam ? CommentStatus.Spam : CommentStatus.Approved
    } catch (err) {
      console.error('Akismet check spam went wrong:', err.message)
      return CommentStatus.Spam
    }
  }
}

export const antiSpamServive = new AntiSpamService()
