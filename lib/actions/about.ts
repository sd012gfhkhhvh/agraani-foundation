'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createAboutContentSchema,
  updateAboutContentSchema,
  type CreateAboutContentInput,
  type UpdateAboutContentInput,
} from '@/lib/validations/about';
import type { ApiResponse } from '@/types/api';
import type { AboutSection } from '@/types/models';
import { revalidatePath } from 'next/cache';

/**
 * Create a new about content section
 * Server action - mutation only
 */
export async function createAboutContent(
  input: CreateAboutContentInput
): Promise<ApiResponse<AboutSection>> {
  try {
    // Validate input
    const validated = createAboutContentSchema.parse(input);

    // Check permission
    await requirePermission(Resource.ABOUT_CONTENT, Action.CREATE);

    // Check if section already exists
    const existing = await prisma.aboutContent.findUnique({
      where: { section: validated.section },
    });

    if (existing) {
      return {
        success: false,
        error: { message: 'A section with this ID already exists' },
      };
    }

    // Create section
    const newSection = await prisma.aboutContent.create({
      data: {
        section: validated.section,
        title: validated.title,
        content: validated.content,
        imageUrl: validated.imageUrl || null,
      },
    });

    // Revalidate pages
    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true, data: newSection };
  } catch (error) {
    logError(error, { action: 'createAboutContent', input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update an existing about content section
 * Server action - mutation only
 */
export async function updateAboutContent(
  id: string,
  input: UpdateAboutContentInput
): Promise<ApiResponse<AboutSection>> {
  try {
    // Validate input
    const validated = updateAboutContentSchema.parse(input);

    // Check permission
    await requirePermission(Resource.ABOUT_CONTENT, Action.UPDATE);

    // Check if section exists
    const section = await prisma.aboutContent.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundError('About content section');
    }

    // Update section
    const updated = await prisma.aboutContent.update({
      where: { id },
      data: {
        ...(validated.title && { title: validated.title }),
        ...(validated.content && { content: validated.content }),
        ...(validated.imageUrl !== undefined && { imageUrl: validated.imageUrl || null }),
      },
    });

    // Revalidate pages
    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true, data: updated };
  } catch (error) {
    logError(error, { action: 'updateAboutContent', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete an about content section
 * Server action - mutation only
 */
export async function deleteAboutContent(id: string): Promise<ApiResponse<void>> {
  try {
    // Check permission
    await requirePermission(Resource.ABOUT_CONTENT, Action.DELETE);

    // Check if section exists
    const section = await prisma.aboutContent.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundError('About content section');
    }

    // Delete section
    await prisma.aboutContent.delete({
      where: { id },
    });

    // Revalidate pages
    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteAboutContent', id });
    return { success: false, error: formatApiError(error) };
  }
}
