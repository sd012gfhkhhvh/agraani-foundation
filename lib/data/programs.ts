/**
 * Data loader for Programs
 * All database read operations for programs
 */

import { prisma } from '@/lib/prisma';
import type { Program } from '@/types/models';

/**
 * Get active programs for public pages
 * Ordered by display order, optionally limited
 */
export async function getActivePrograms(limit?: number): Promise<Program[]> {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      icon: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
    ...(limit && { take: limit }),
  });

  return programs;
}

/**
 * Get a program by slug
 * Returns null if not found (for notFound() handling)
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const program = await prisma.program.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      icon: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return program;
}

/**
 * Get all programs (for admin)
 */
export async function getAllPrograms(): Promise<Program[]> {
  const programs = await prisma.program.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      icon: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return programs;
}
