'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createObjectiveSchema,
  updateObjectiveSchema,
  type CreateObjectiveInput,
  type UpdateObjectiveInput,
} from '@/lib/validations/objectives';
import type { ApiResponse } from '@/types/api';
import type { Objective } from '@/types/models';
import { revalidatePath } from 'next/cache';

export async function createObjective(
  input: CreateObjectiveInput
): Promise<ApiResponse<Objective>> {
  try {
    const validated = createObjectiveSchema.parse(input);
    await requirePermission(Resource.OBJECTIVES, Action.CREATE);

    const objective = await prisma.objective.create({
      data: validated,
    });

    revalidatePath('/admin/objectives');
    revalidatePath('/');

    return { success: true, data: objective };
  } catch (error) {
    logError(error, { action: 'createObjective', input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateObjective(
  id: string,
  input: UpdateObjectiveInput
): Promise<ApiResponse<Objective>> {
  try {
    const validated = updateObjectiveSchema.parse(input);
    await requirePermission(Resource.OBJECTIVES, Action.UPDATE);

    const existing = await prisma.objective.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Objective');

    const objective = await prisma.objective.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/objectives');
    revalidatePath('/');

    return { success: true, data: objective };
  } catch (error) {
    logError(error, { action: 'updateObjective', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteObjective(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.OBJECTIVES, Action.DELETE);

    const objective = await prisma.objective.findUnique({ where: { id } });
    if (!objective) throw new NotFoundError('Objective');

    await prisma.objective.delete({
      where: { id },
    });

    revalidatePath('/admin/objectives');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteObjective', id });
    return { success: false, error: formatApiError(error) };
  }
}
