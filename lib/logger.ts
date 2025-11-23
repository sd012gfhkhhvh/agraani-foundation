/**
 * Centralized error logging utility
 * Provides Sentry integration hooks with console fallback
 */

type LogLevel = 'error' | 'warning' | 'info';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Log an error with context
 * In production, this would send to Sentry
 */
export function logError(error: unknown, context?: LogContext): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // TODO: Integrate with Sentry in production
  // if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }

  console.error('[ERROR]', errorMessage, {
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log a warning with context
 */
export function logWarning(message: string, context?: LogContext): void {
  // TODO: Integrate with Sentry in production
  // if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureMessage(message, { level: 'warning', contexts: { custom: context } });
  // }

  console.warn('[WARNING]', message, {
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log an info message with context
 */
export function logInfo(message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('[INFO]', message, {
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
