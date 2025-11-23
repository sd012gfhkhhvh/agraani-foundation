/**
 * Data loader for Dashboard Statistics
 * All database read operations for admin dashboard
 */

import { prisma } from '@/lib/prisma';

export interface DashboardStats {
  programsCount: number;
  activeProgramsCount: number;
  blogPostsCount: number;
  publishedBlogsCount: number;
  galleryCount: number;
  unreadContactSubmissions: number;
  totalContactSubmissions: number;
  teamMembersCount: number;
  objectivesCount: number;
  heroBannersCount: number;
}

/**
 * Get comprehensive dashboard statistics
 * Used for admin dashboard overview
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    programsCount,
    activeProgramsCount,
    blogPostsCount,
    publishedBlogsCount,
    galleryCount,
    unreadContactSubmissions,
    totalContactSubmissions,
    teamMembersCount,
    objectivesCount,
    heroBannersCount,
  ] = await Promise.all([
    prisma.program.count(),
    prisma.program.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.galleryItem.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.contactSubmission.count(),
    prisma.teamMember.count(),
    prisma.objective.count(),
    prisma.heroBanner.count(),
  ]);

  return {
    programsCount,
    activeProgramsCount,
    blogPostsCount,
    publishedBlogsCount,
    galleryCount,
    unreadContactSubmissions,
    totalContactSubmissions,
    teamMembersCount,
    objectivesCount,
    heroBannersCount,
  };
}
