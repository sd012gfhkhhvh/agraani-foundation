'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth-utils';
import { Resource, Action } from '@/lib/permissions';
import { formatApiError, logError } from '@/lib/errors';

export async function getPrograms(activeOnly: boolean = true) {
  try {
    const programs = await prisma.program.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
    return { success: true, data: programs };
  } catch (error) {
    logError(error, { action: 'getPrograms' });
    return { success: false, error: formatApiError(error) };
  }
}

export async function createProgram(data: {
  title: string;
  slug: string;
 description: string;
  imageUrl?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    await requirePermission(Resource.PROGRAMS, Action.CREATE);
    const program = await prisma.program.create({ data });
    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');
    return { success: true, data: program };
  } catch (error) {
    logError(error, { action: 'createProgram', data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateProgram(id: string, data: Partial<{
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  order: number;
  isActive: boolean;
}>) {
  try {
    await requirePermission(Resource.PROGRAMS, Action.UPDATE);
    const program = await prisma.program.update({ where: { id }, data });
    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');
    return { success: true, data: program };
  } catch (error) {
    logError(error, { action: 'updateProgram', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteProgram(id: string) {
  try {
    await requirePermission(Resource.PROGRAMS, Action.DELETE);
    const program = await prisma.program.delete({ where: { id } });
    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');
    return { success: true, data: program };
  } catch (error) {
    logError(error, { action: 'deleteProgram', id });
    return { success: false, error: formatApiError(error) };
  }
}
