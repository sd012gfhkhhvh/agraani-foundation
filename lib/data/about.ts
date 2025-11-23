/**
 * Data loader for About content
 * All database read operations for about sections
 */

import { prisma } from '@/lib/prisma';
import type { AboutSection } from '@/types/models';

/**
 * Get all about content sections
 * Used for public about page and admin management
 */
export async function getAboutContent(): Promise<AboutSection[]> {
  const sections = await prisma.aboutContent.findMany({
    select: {
      id: true,
      section: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { section: 'asc' },
  });

  return sections;
}

/**
 * Get a specific about section by section identifier
 * Returns null if not found (for notFound() handling)
 */
export async function getAboutSection(section: string): Promise<AboutSection | null> {
  const content = await prisma.aboutContent.findUnique({
    where: { section },
    select: {
      id: true,
      section: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return content;
}
