/**
 * Data loader for Blog Posts
 * All database read operations for blog
 */

import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@/types/models';

export interface PaginatedBlogResult {
  posts: BlogPost[];
  totalCount: number;
  totalPages: number;
}

/**
 * Get paginated published blog posts for public pages
 * Returns posts for current page + total count
 */
export async function getBlogPostsPaginated({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}): Promise<PaginatedBlogResult> {
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await prisma.$transaction([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        author: true,
        category: true,
        tags: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ]);

  return {
    posts,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get published blog posts for public pages
 * Ordered by published date, optionally limited
 * @deprecated Use getBlogPostsPaginated for better performance
 */
export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      category: true,
      tags: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { publishedAt: 'desc' },
    ...(limit && { take: limit }),
  });

  return posts;
}

/**
 * Get a blog post by slug
 * Returns null if not found or not published (for notFound() handling)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      category: true,
      tags: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return post;
}

/**
 * Get all blog posts including unpublished (for admin)
 */
export async function getAllBlogPosts(includeUnpublished: boolean = true): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: includeUnpublished ? {} : { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      category: true,
      tags: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return posts;
}
