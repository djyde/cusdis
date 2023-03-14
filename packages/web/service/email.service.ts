import { resolvedConfig } from '../utils.server'
import * as nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
import { statService } from './stat.service'

export class EmailService {
  isSMTPEnable() {
    return (
      resolvedConfig.smtp.auth.user !== undefined &&
      resolvedConfig.smtp.auth.pass !== undefined &&
      resolvedConfig.smtp.host !== undefined &&
      resolvedConfig.smtp.senderAddress !== undefined
    )
  }

  isThirdpartyEnable() {
    return resolvedConfig.sendgrid.apiKey
  }

  get sender() {
    return resolvedConfig.smtp.senderAddress
  }

  async send(msg: { to: string; from: string; subject: string; html: string }) {
    if (this.isSMTPEnable()) {
      const transporter = nodemailer.createTransport({
        host: resolvedConfig.smtp.host,
        port: resolvedConfig.smtp.port,
        secure: resolvedConfig.smtp.secure,
        auth: resolvedConfig.smtp.auth,
      })
      await transporter.sendMail(msg)
    } else if (this.isThirdpartyEnable()) {
      sgMail.setApiKey(resolvedConfig.sendgrid.apiKey)
      await sgMail.send(msg)
      statService.capture('notification_email')
    }
  }
}
