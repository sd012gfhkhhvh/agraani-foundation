'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError, NotFoundError } from '@/lib/errors';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Get all about content sections
export async function getAboutContent() {
  try {
    const sections = await prisma.aboutContent.findMany({
      orderBy: { section: 'asc' },
    });

    return { success: true, data: sections };
  } catch (error) {
    logError(error, { action: 'getAboutContent' });
    return { success: false, error: formatApiError(error) };
  }
}

// Create about content section
export async function createAboutContent(data: {
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
}) {
  try {
    await requirePermission(Resource.ABOUT_CONTENT, Action.CREATE);

    // Check if section already exists
    const existing = await prisma.aboutContent.findUnique({
      where: { section: data.section },
    });

    if (existing) {
      return {
        success: false,
        error: { message: 'A section with this ID already exists' },
      };
    }

    const newSection = await prisma.aboutContent.create({
      data,
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true, data: newSection };
  } catch (error) {
    logError(error, { action: 'createAboutContent', data });
    return { success: false, error: formatApiError(error) };
  }
}

// Update about content section
export async function updateAboutContent(
  id: string,
  data: {
    title?: string;
    content?: string;
    imageUrl?: string;
  }
) {
  try {
    await requirePermission(Resource.ABOUT_CONTENT, Action.UPDATE);

    const section = await prisma.aboutContent.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundError('About content section');
    }

    const updated = await prisma.aboutContent.update({
      where: { id },
      data,
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true, data: updated };
  } catch (error) {
    logError(error, { action: 'updateAboutContent', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

// Delete about content section
export async function deleteAboutContent(id: string) {
  try {
    await requirePermission(Resource.ABOUT_CONTENT, Action.DELETE);

    const section = await prisma.aboutContent.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundError('About content section');
    }

    await prisma.aboutContent.delete({
      where: { id },
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteAboutContent', id });
    return { success: false, error: formatApiError(error) };
  }
}
