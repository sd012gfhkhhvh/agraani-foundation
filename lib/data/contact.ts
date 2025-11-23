/**
 * Data loader for Contact Submissions
 * All database read operations for contact form submissions
 */

import { prisma } from '@/lib/prisma';
import type { PaginatedResponse } from '@/types/api';
import type { ContactSubmission } from '@/types/models';

/**
 * Get all contact submissions with pagination
 * Ordered by creation date (newest first)
 */
export async function getContactSubmissions(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<ContactSubmission>> {
  const skip = (page - 1) * pageSize;

  const [submissions, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.contactSubmission.count(),
  ]);

  return {
    items: submissions,
    total,
    page,
    pageSize,
    hasMore: skip + submissions.length < total,
  };
}

/**
 * Get unread contact submissions count
 */
export async function getUnreadSubmissionsCount(): Promise<number> {
  return await prisma.contactSubmission.count({
    where: { isRead: false },
  });
}
