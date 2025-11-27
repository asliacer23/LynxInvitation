import React, { ReactNode, ReactElement } from 'react';
import { errorLogger } from '@/lib/errorLogger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to our error logger
    errorLogger.error('React Component Error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-700 mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-red-100 border border-red-400 rounded-lg p-4 text-left mb-6 max-h-48 overflow-auto">
                  <p className="font-bold text-red-800 mb-2">Error Details (Development Only):</p>
                  <p className="text-red-700 text-sm font-mono break-words">{this.state.error.toString()}</p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
