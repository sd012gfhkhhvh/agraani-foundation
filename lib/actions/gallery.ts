'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createGalleryItemSchema,
  updateGalleryItemSchema,
  type CreateGalleryItemInput,
  type UpdateGalleryItemInput,
} from '@/lib/validations/gallery';
import type { ApiResponse } from '@/types/api';
import type { GalleryItem } from '@/types/models';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createGalleryItem(
  input: CreateGalleryItemInput
): Promise<ApiResponse<GalleryItem>> {
  try {
    const validated = createGalleryItemSchema.parse(input);
    await requirePermission(Resource.GALLERY, Action.CREATE);

    const item = await prisma.galleryItem.create({
      data: validated,
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    revalidateTag('gallery');

    return { success: true, data: item };
  } catch (error) {
    logError(error, { action: 'createGalleryItem', input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateGalleryItem(
  id: string,
  input: UpdateGalleryItemInput
): Promise<ApiResponse<GalleryItem>> {
  try {
    const validated = updateGalleryItemSchema.parse(input);
    await requirePermission(Resource.GALLERY, Action.UPDATE);

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Gallery item');

    const item = await prisma.galleryItem.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    revalidateTag('gallery');

    return { success: true, data: item };
  } catch (error) {
    logError(error, { action: 'updateGalleryItem', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteGalleryItem(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.GALLERY, Action.DELETE);

    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Gallery item');

    await prisma.galleryItem.delete({
      where: { id },
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    revalidateTag('gallery');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteGalleryItem', id });
    return { success: false, error: formatApiError(error) };
  }
}
