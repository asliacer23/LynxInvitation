/**
 * Error Logger Service
 * Centralized error logging for the application
 */

export enum ErrorLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  timestamp: string;
  level: ErrorLevel;
  message: string;
  error?: Error | unknown;
  context?: Record<string, any>;
  userAgent?: string;
}

class ErrorLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  /**
   * Log an error or message
   */
  log(
    message: string,
    level: ErrorLevel = ErrorLevel.ERROR,
    error?: Error | unknown,
    context?: Record<string, any>
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.logs.push(entry);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const logFn = this.getConsoleFn(level);
      logFn(message, error, context);
    }

    // Send critical errors to monitoring service (optional)
    if (level === ErrorLevel.CRITICAL) {
      this.reportCriticalError(entry);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log(message, ErrorLevel.INFO, undefined, context);
  }

  warning(message: string, error?: Error | unknown, context?: Record<string, any>) {
    this.log(message, ErrorLevel.WARNING, error, context);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    this.log(message, ErrorLevel.ERROR, error, context);
  }

  critical(message: string, error?: Error | unknown, context?: Record<string, any>) {
    this.log(message, ErrorLevel.CRITICAL, error, context);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get console function based on log level
   */
  private getConsoleFn(level: ErrorLevel) {
    switch (level) {
      case ErrorLevel.INFO:
        return console.info;
      case ErrorLevel.WARNING:
        return console.warn;
      case ErrorLevel.ERROR:
        return console.error;
      case ErrorLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Report critical errors (integrate with your error tracking service)
   */
  private reportCriticalError(entry: LogEntry) {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    console.error('CRITICAL ERROR REPORTED:', entry);
  }
}

export const errorLogger = new ErrorLogger();
