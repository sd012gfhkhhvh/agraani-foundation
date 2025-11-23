/**
 * Data loader for Hero Banners
 * All database read operations for hero banners
 */

import { prisma } from '@/lib/prisma';
import type { HeroBanner } from '@/types/models';

/**
 * Get active hero banners for homepage
 * Ordered by display order, limited to specified count
 */
export async function getActiveHeroBanners(limit: number = 5): Promise<HeroBanner[]> {
  const banners = await prisma.heroBanner.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      imageUrl: true,
      ctaText: true,
      ctaLink: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
    take: limit,
  });

  return banners;
}

/**
 * Get all hero banners (for admin)
 */
export async function getAllHeroBanners(): Promise<HeroBanner[]> {
  const banners = await prisma.heroBanner.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      imageUrl: true,
      ctaText: true,
      ctaLink: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return banners;
}
