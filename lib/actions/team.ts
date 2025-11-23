'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  type CreateTeamMemberInput,
  type UpdateTeamMemberInput,
} from '@/lib/validations/team';
import type { ApiResponse } from '@/types/api';
import type { TeamMember } from '@/types/models';
import { revalidatePath } from 'next/cache';

export async function createTeamMember(
  input: CreateTeamMemberInput
): Promise<ApiResponse<TeamMember>> {
  try {
    const validated = createTeamMemberSchema.parse(input);
    await requirePermission(Resource.TEAM_MEMBERS, Action.CREATE);

    const member = await prisma.teamMember.create({
      data: validated,
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true, data: member };
  } catch (error) {
    logError(error, { action: 'createTeamMember', input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateTeamMember(
  id: string,
  input: UpdateTeamMemberInput
): Promise<ApiResponse<TeamMember>> {
  try {
    const validated = updateTeamMemberSchema.parse(input);
    await requirePermission(Resource.TEAM_MEMBERS, Action.UPDATE);

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Team member');

    const member = await prisma.teamMember.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true, data: member };
  } catch (error) {
    logError(error, { action: 'updateTeamMember', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteTeamMember(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.TEAM_MEMBERS, Action.DELETE);

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundError('Team member');

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath('/admin/team');
    revalidatePath('/team');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteTeamMember', id });
    return { success: false, error: formatApiError(error) };
  }
}
