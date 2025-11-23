'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import NextImage from 'next/image';

interface AdminCardProps {
  title: string;
  subtitle?: React.ReactNode;
  image?: string | null;
  placeholderIcon?: React.ElementType;
  status?: {
    isActive: boolean;
    activeText?: string;
    inactiveText?: string;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AdminCard({
  title,
  subtitle,
  image,
  placeholderIcon: PlaceholderIcon,
  status,
  actions,
  children,
  className,
  onClick,
}: AdminCardProps) {
  return (
    <Card
      className={cn(
        'group overflow-hidden bg-card text-card-foreground border-border transition-all duration-300 hover:shadow-xl hover:border-primary/50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {(image || PlaceholderIcon) && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
          {image ? (
            <NextImage
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            PlaceholderIcon && (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {PlaceholderIcon && (
                  <PlaceholderIcon className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
            )
          )}
          {status && (
            <div className="absolute top-3 right-3">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-md',
                  status.isActive ? 'bg-white/90 text-green-700' : 'bg-white/90 text-red-700'
                )}
              >
                {status.isActive ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {status.isActive
                  ? status.activeText || 'Active'
                  : status.inactiveText || 'Inactive'}
              </div>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              {!image && status && (
                <div
                  className={cn(
                    'shrink-0 rounded-full p-0.5',
                    status.isActive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {status.isActive ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
            {subtitle && (
              <div className="text-sm text-muted-foreground line-clamp-2">{subtitle}</div>
            )}
          </div>
        </div>

        {children && <div className="mt-4 pt-4 border-t border-muted/60">{children}</div>}

        {actions && (
          <div className="mt-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
