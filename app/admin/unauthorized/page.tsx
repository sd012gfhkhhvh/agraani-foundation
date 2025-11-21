"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 mb-4 animate-fade-in">
            <ShieldAlert className="h-12 w-12 text-amber-600" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 animate-fade-in">
          Access Denied
        </h2>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          <Link href="/admin/dashboard">
            <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
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

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-500">
            Need higher access permissions? Contact your Super Administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
