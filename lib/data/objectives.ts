/**
 * Data loader for Objectives
 * All database read operations for objectives
 */

import { prisma } from '@/lib/prisma';
import type { Objective } from '@/types/models';

/**
 * Get active objectives for public pages
 * Ordered by display order, optionally limited
 */
export async function getActiveObjectives(limit?: number): Promise<Objective[]> {
  const objectives = await prisma.objective.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
    ...(limit && { take: limit }),
  });

  return objectives;
}

/**
 * Get all objectives (for admin)
 */
export async function getAllObjectives(): Promise<Objective[]> {
  const objectives = await prisma.objective.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return objectives;
}
