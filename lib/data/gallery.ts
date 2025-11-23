/**
 * Data loader for Gallery Items
 * All database read operations for gallery
 */

import { prisma } from '@/lib/prisma';
import type { GalleryItem } from '@/types/models';

export interface GalleryFilters {
  type?: 'IMAGE' | 'VIDEO';
  category?: string;
}

/**
 * Get active gallery items for public pages
 * Supports filtering by type and category
 */
export async function getActiveGalleryItems(filters?: GalleryFilters): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    where: {
      isActive: true,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.category && { category: filters.category }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
      type: true,
      category: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return items;
}

/**
 * Get all gallery items (for admin)
 */
export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
      type: true,
      category: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return items;
}
