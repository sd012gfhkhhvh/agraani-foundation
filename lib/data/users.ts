/**
 * Data loader for Users
 * All database read operations for user management
 */

import { prisma } from '@/lib/prisma';
import type { User } from '@/types/models';

/**
 * Get all users
 * Ordered by creation date
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

/**
 * Get a user by ID
 * Returns null if not found
 */
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
