/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const log = (level: LogLevel, message: string, payload?: unknown) => {
  if (__DEV__) {
    const timestamp = new Date().toISOString();
    console[level](`[JANI][${timestamp}] ${message}`, payload ?? '');
  }
};

export const logger = {
  info: (message: string, payload?: unknown) => log('info', message, payload),
  warn: (message: string, payload?: unknown) => log('warn', message, payload),
  error: (message: string, payload?: unknown) => log('error', message, payload),
  debug: (message: string, payload?: unknown) => log('debug', message, payload)
};
