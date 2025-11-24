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

export interface PaginatedGalleryResult {
  items: GalleryItem[];
  totalCount: number;
  totalPages: number;
}

/**
 * Get paginated gallery items for public pages
 * Returns items for current page + total count
 */
export async function getGalleryItemsPaginated({
  page = 1,
  limit = 24,
  filters,
}: {
  page?: number;
  limit?: number;
  filters?: GalleryFilters;
}): Promise<PaginatedGalleryResult> {
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(filters?.type && { type: filters.type }),
    ...(filters?.category && { category: filters.category }),
  };

  const [items, totalCount] = await prisma.$transaction([
    prisma.galleryItem.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.galleryItem.count({ where }),
  ]);

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get active gallery items for public pages
 * Supports filtering by type and category
 * @deprecated Use getGalleryItemsPaginated for better performance
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

/**
 * Get all unique categories from active gallery items with counts
 * Optimized query - fetches only distinct category names and counts
 */
export async function getGalleryCategoriesWithCounts() {
  const result = await prisma.galleryItem.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: true,
  });

  return result.map((item) => ({
    category: item.category || 'Uncategorized',
    count: item._count,
  }));
}
