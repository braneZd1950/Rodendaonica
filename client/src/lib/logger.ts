import { env } from '../config/env'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function log(level: LogLevel, message: string, meta?: unknown) {
  if (env.isProd && level === 'debug') return

  const prefix = `[Rođendaonica:${level}]`
  if (meta !== undefined) {
    console[level](prefix, message, meta)
  } else {
    console[level](prefix, message)
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
}
