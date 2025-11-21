'use client';

import { UserRole } from '@prisma/client';
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

/**
 * Visual badge component for displaying user roles
 */
export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${getRoleBadgeColor(role)} ${className}`}
    >
      {getRoleDisplayName(role)}
    </Badge>
  );
}
