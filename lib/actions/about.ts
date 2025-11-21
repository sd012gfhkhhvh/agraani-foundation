'use server';

import { getCurrentUser } from '@/lib/auth-utils';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { Action, hasPermission, Resource } from '@/lib/permissions';
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
    console.error('Error fetching about content:', error);
    return { success: false, error: { message: 'Failed to fetch about content' } };
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
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Resource.ABOUT_CONTENT, Action.UPDATE)) {
      throw new ForbiddenError('You do not have permission to update about content');
    }

    const section = await prisma.aboutContent.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundError('About content section not found');
    }

    const updated = await prisma.aboutContent.update({
      where: { id },
      data,
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating about content:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Failed to update about content',
        statusCode: error.statusCode || 500,
      },
    };
  }
}
