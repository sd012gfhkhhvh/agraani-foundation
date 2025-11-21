'use client';

import { Badge } from '@/components/ui/badge';
import { getRoleBadgeColor, getRoleDisplayName } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

/**
 * Visual badge component for displaying user roles
 */
export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  return (
    <Badge variant="outline" className={`${getRoleBadgeColor(role)} ${className}`}>
      {getRoleDisplayName(role)}
    </Badge>
  );
}
