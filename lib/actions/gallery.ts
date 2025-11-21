'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth-utils';
import { MediaType } from '@prisma/client';
import { formatApiError, logError } from '@/lib/errors';
import { Resource, Action } from '@/lib/permissions';

/**
 * Get all gallery items
 */
export async function getGalleryItems(activeOnly: boolean = true) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: items };
  } catch (error) {
    logError(error, { action: 'getGalleryItems' });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Create a gallery item (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function createGalleryItem(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  type: MediaType;
  category?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    await requirePermission(Resource.GALLERY, Action.CREATE);

    const item = await prisma.galleryItem.create({
      data,
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true, data: item };
  } catch (error) {
    logError(error, { action: 'createGalleryItem', data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update a gallery item (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function updateGalleryItem(id: string, data: Partial<{
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  type: MediaType;
  category: string;
  order: number;
  isActive: boolean;
}>) {
  try {
    await requirePermission(Resource.GALLERY, Action.UPDATE);

    const item = await prisma.galleryItem.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true, data: item };
  } catch (error) {
    logError(error, { action: 'updateGalleryItem', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a gallery item (requires CONTENT_ADMIN or SUPER_ADMIN)
 */
export async function deleteGalleryItem(id: string) {
  try {
    await requirePermission(Resource.GALLERY, Action.DELETE);

    const item = await prisma.galleryItem.delete({
      where: { id },
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true, data: item };
  } catch (error) {
    logError(error, { action: 'deleteGalleryItem', id });
    return { success: false, error: formatApiError(error) };
  }
}
