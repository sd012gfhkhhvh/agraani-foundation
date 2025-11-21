'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError } from '@/lib/errors';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Get all team members
 */
export async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });

    return { success: true, data: members };
  } catch (error) {
    logError(error, { action: 'getTeamMembers' });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Create a team member (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function createTeamMember(data: {
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    await requirePermission(Resource.TEAM_MEMBERS, Action.CREATE);

    const member = await prisma.teamMember.create({
      data,
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true, data: member };
  } catch (error) {
    logError(error, { action: 'createTeamMember', data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update a team member (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function updateTeamMember(
  id: string,
  data: Partial<{
    name: string;
    position: string;
    bio: string;
    imageUrl: string;
    email: string;
    phone: string;
    linkedIn: string;
    order: number;
    isActive: boolean;
  }>
) {
  try {
    await requirePermission(Resource.TEAM_MEMBERS, Action.UPDATE);

    const member = await prisma.teamMember.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true, data: member };
  } catch (error) {
    logError(error, { action: 'updateTeamMember', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a team member (requires CONTENT_ADMIN or SUPER_ADMIN)
 */
export async function deleteTeamMember(id: string) {
  try {
    await requirePermission(Resource.TEAM_MEMBERS, Action.DELETE);

    const member = await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true, data: member };
  } catch (error) {
    logError(error, { action: 'deleteTeamMember', id });
    return { success: false, error: formatApiError(error) };
  }
}
