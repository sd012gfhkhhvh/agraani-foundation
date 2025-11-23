'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createProgramSchema,
  updateProgramSchema,
  type CreateProgramInput,
  type UpdateProgramInput,
} from '@/lib/validations/programs';
import type { ApiResponse } from '@/types/api';
import type { Program } from '@/types/models';
import { revalidatePath } from 'next/cache';

/**
 * Create a new program
 * Server action - mutation only
 */
export async function createProgram(input: CreateProgramInput): Promise<ApiResponse<Program>> {
  try {
    const validated = createProgramSchema.parse(input);
    await requirePermission(Resource.PROGRAMS, Action.CREATE);

    const program = await prisma.program.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        imageUrl: validated.imageUrl || null,
        icon: validated.icon || null,
        order: validated.order || 0,
        isActive: validated.isActive ?? true,
      },
    });

    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');

    return { success: true, data: program };
  } catch (error) {
    logError(error, { action: 'createProgram', input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update an existing program
 * Server action - mutation only
 */
export async function updateProgram(
  id: string,
  input: UpdateProgramInput
): Promise<ApiResponse<Program>> {
  try {
    const validated = updateProgramSchema.parse(input);
    await requirePermission(Resource.PROGRAMS, Action.UPDATE);

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Program');
    }

    const program = await prisma.program.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');

    return { success: true, data: program };
  } catch (error) {
    logError(error, { action: 'updateProgram', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a program
 * Server action - mutation only
 */
export async function deleteProgram(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.PROGRAMS, Action.DELETE);

    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundError('Program');
    }

    await prisma.program.delete({ where: { id } });

    revalidatePath('/admin/programs');
    revalidatePath('/programs');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteProgram', id });
    return { success: false, error: formatApiError(error) };
  }
}
