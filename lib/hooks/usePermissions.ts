'use client';

import { Resource, canManageUsers, getResourcePermissions } from '@/lib/permissions';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';

/**
 * Client-side hook for checking user permissions
 * Use this in client components to conditionally render UI elements
 */
export function usePermissions(resource: Resource) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const permissions = getResourcePermissions(userRole, resource);

  return {
    ...permissions,
    role: userRole,
    isLoading: !session,
  };
}

/**
 * Hook to check if current user can manage users
 */
export function useCanManageUsers() {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  return {
    canManageUsers: canManageUsers(userRole),
    role: userRole,
    isLoading: !session,
  };
}

/**
 * Hook to get current user info
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    role: session?.user?.role as UserRole | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };
}
