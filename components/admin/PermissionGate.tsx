'use client';

import { ReactNode } from 'react';
import { UserRole } from '@prisma/client';
import { Resource } from '@/lib/permissions';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface PermissionGateProps {
  resource: Resource;
  action: 'view' | 'create' | 'update' | 'delete';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 * Usage: <PermissionGate resource={Resource.BLOG_POSTS} action="delete">...</PermissionGate>
 */
export function PermissionGate({ resource, action, children, fallback = null }: PermissionGateProps) {
  const permissions = usePermissions(resource);

  const hasAccess = {
    view: permissions.canView,
    create: permissions.canCreate,
    update: permissions.canUpdate,
    delete: permissions.canDelete,
  }[action];

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
