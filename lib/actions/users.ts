'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { updateUserRoleSchema, type UpdateUserRoleInput } from '@/lib/validations/users';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/models';
import { revalidatePath } from 'next/cache';

/**
 * Update user role (SUPER_ADMIN only)
 * Server action - mutation only
 */
export async function updateUserRole(
  userId: string,
  input: UpdateUserRoleInput
): Promise<ApiResponse<User>> {
  try {
    const validated = updateUserRoleSchema.parse(input);
    await requirePermission(Resource.USERS, Action.MANAGE_ROLES);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) throw new NotFoundError('User');

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: validated.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath('/admin/users');

    return { success: true, data: user };
  } catch (error) {
    logError(error, { action: 'updateUserRole', userId, input });
    return { success: false, error: formatApiError(error) };
  }
}
