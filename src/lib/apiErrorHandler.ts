import { errorLogger } from '@/lib/errorLogger';
import type { ClientError, ApiResponse } from '@/types';

/**
 * Global error handler for API responses and network errors
 */
export class ApiErrorHandler {
  /**
   * Handle API errors uniformly
   */
  static handle(error: unknown, context?: string): never {
    const clientError: ClientError = this.normalize(error);

    // Log the error
    errorLogger.error(
      `API Error: ${clientError.message}`,
      clientError,
      {
        context,
        statusCode: clientError.statusCode,
        code: clientError.code,
      }
    );

    throw clientError;
  }

  /**
   * Handle API response errors
   */
  static handleResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response.success && response.error) {
      this.handle(new Error(response.error), 'API Response Error');
    }
    return response;
  }

  /**
   * Normalize different error types
   */
  private static normalize(error: unknown): ClientError {
    if (error instanceof Error) {
      const clientError = new Error(error.message) as ClientError;
      clientError.stack = error.stack;
      return clientError;
    }

    if (typeof error === 'string') {
      return new Error(error) as ClientError;
    }

    if (typeof error === 'object' && error !== null) {
      const obj = error as any;
      const clientError = new Error(obj.message || 'Unknown error') as ClientError;
      clientError.statusCode = obj.statusCode || obj.status;
      clientError.code = obj.code;
      return clientError;
    }

    return new Error('An unknown error occurred') as ClientError;
  }

  /**
   * Handle network errors with retry logic
   */
  static async handleNetworkError(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = this.normalize(error);

        if (i < maxRetries - 1) {
          // Exponential backoff
          const delay = Math.pow(2, i) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}

export default ApiErrorHandler;
