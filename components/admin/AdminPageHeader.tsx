'use client';

import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gradient-primary tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
