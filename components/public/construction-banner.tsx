'use client';

import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const BANNER_STORAGE_KEY = 'construction-banner-dismissed';

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY);
    setIsVisible(!isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 animate-pulse" />
            <p className="text-sm font-medium sm:text-base">
              <span className="font-bold">Website Under Construction:</span> We're currently
              improving our website to serve you better. Some features may be in development.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1.5 hover:bg-white/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
