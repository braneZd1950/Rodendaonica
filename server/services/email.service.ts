import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

export interface SendEmailInput {
  to: string
  subject: string
  text: string
  html: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (!env.smtpHost) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth:
        env.smtpUser && env.smtpPass
          ? { user: env.smtpUser, pass: env.smtpPass }
          : undefined,
    })
  }
  return transporter
}

function logEmail(input: SendEmailInput) {
  console.log('\n--- EMAIL (log-only, SMTP nije konfiguriran) ---')
  console.log(`To: ${input.to}`)
  console.log(`Subject: ${input.subject}`)
  console.log(input.text)
  console.log('---\n')
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const transport = getTransporter()
  if (!transport) {
    logEmail(input)
    return
  }

  await transport.sendMail({
    from: env.emailFrom,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })
}

export function isEmailConfigured() {
  return Boolean(env.smtpHost)
}
