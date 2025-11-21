'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gradient-primary animate-fade-in">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          <Link href="/">
            <Button size="lg" className="btn-gradient-primary">
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about" className="text-primary hover:underline">
              About Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/programs" className="text-primary hover:underline">
              Our Programs
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/donate" className="text-primary hover:underline">
              Donate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
