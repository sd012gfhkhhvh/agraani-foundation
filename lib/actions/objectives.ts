'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth-utils';
import { Resource, Action } from '@/lib/permissions';
import { formatApiError, logError } from '@/lib/errors';

export async function getObjectives(activeOnly: boolean = true) {
  try {
    const objectives = await prisma.objective.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
    return { success: true, data: objectives };
  } catch (error) {
    logError(error, { action: 'getObjectives' });
    return { success: false, error: formatApiError(error) };
  }
}

export async function createObjective(data: {
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    await requirePermission(Resource.OBJECTIVES, Action.CREATE);
    const objective = await prisma.objective.create({ data });
    revalidatePath('/admin/objectives');
    revalidatePath('/');
    return { success: true, data: objective };
  } catch (error) {
    logError(error, { action: 'createObjective', data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateObjective(id: string, data: Partial<{
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}>) {
  try {
    await requirePermission(Resource.OBJECTIVES, Action.UPDATE);
    const objective = await prisma.objective.update({ where: { id }, data });
    revalidatePath('/admin/objectives');
    revalidatePath('/');
    return { success: true, data: objective };
  } catch (error) {
    logError(error, { action: 'updateObjective', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteObjective(id: string) {
  try {
    await requirePermission(Resource.OBJECTIVES, Action.DELETE);
    const objective = await prisma.objective.delete({ where: { id } });
    revalidatePath('/admin/objectives');
    revalidatePath('/');
    return { success: true, data: objective };
  } catch (error) {
    logError(error, { action: 'deleteObjective', id });
    return { success: false, error: formatApiError(error) };
  }
}
