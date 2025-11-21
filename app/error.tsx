'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted px-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-4 animate-fade-in">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
          Something Went Wrong
        </h2>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
          We encountered an unexpected error. Don't worry, our team has been notified.
        </p>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-muted rounded-lg text-left max-w-lg mx-auto">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          <Button
            size="lg"
            onClick={reset}
            className="btn-gradient-primary"
          >
            <RefreshCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
