'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError } from '@/lib/errors';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Get all users (SUPER_ADMIN only)
 */
export async function getUsers() {
  try {
    await requirePermission(Resource.USERS, Action.VIEW);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: users };
  } catch (error) {
    logError(error, { action: 'getUsers' });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update user role (SUPER_ADMIN only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await requirePermission(Resource.USERS, Action.MANAGE_ROLES);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    revalidatePath('/admin/users');

    return { success: true, data: user };
  } catch (error) {
    logError(error, { action: 'updateUserRole', userId, role });
    return { success: false, error: formatApiError(error) };
  }
}
