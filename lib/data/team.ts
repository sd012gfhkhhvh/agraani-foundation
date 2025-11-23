/**
 * Data loader for Team Members
 * All database read operations for team members
 */

import { prisma } from '@/lib/prisma';
import type { TeamMember } from '@/types/models';

/**
 * Get active team members for public pages
 * Ordered by display order
 */
export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      position: true,
      bio: true,
      imageUrl: true,
      email: true,
      phone: true,
      linkedIn: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return members;
}

/**
 * Get all team members (for admin)
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const members = await prisma.teamMember.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      bio: true,
      imageUrl: true,
      email: true,
      phone: true,
      linkedIn: true,
      order: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return members;
}
