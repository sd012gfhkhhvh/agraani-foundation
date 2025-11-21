import { auth } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors';
import { Action, hasPermission, Resource } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require user to have specific permission for a resource/action
 * This is the recommended way to check permissions in server actions
 *
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @param context - Optional context for better error messages and debugging
 * @returns The authenticated user
 * @throws {ForbiddenError} If user lacks permission
 */
export async function requirePermission(
  resource: Resource,
  action: Action,
  context?: {
    itemId?: string;
    itemName?: string;
    [key: string]: any;
  }
) {
  const user = await requireAuth();

  if (!hasPermission(user.role as UserRole, resource, action)) {
    const { getPermissionDescription } = await import('@/lib/permissions');

    throw new ForbiddenError(
      `You do not have permission to ${getPermissionDescription(resource, action)}`,
      {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        resource,
        action,
        timestamp: new Date().toISOString(),
        ...context,
      }
    );
  }

  return user;
}

/**
 * @deprecated Use requirePermission(resource, action) instead for granular permission checks
 * Kept for backward compatibility during transition
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!user.role || !allowedRoles.includes(user.role as UserRole)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return user;
}
