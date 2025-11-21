'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError, NotFoundError } from '@/lib/errors';
import { Resource, Action } from '@/lib/permissions';

/**
 * Get all blog posts (optionally include unpublished for admin)
 */
export async function getBlogPosts(includeUnpublished: boolean = false) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: includeUnpublished ? {} : { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: posts };
  } catch (error) {
    logError(error, { action: 'getBlogPosts' });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError('Blog post');
    }

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'getBlogPostBySlug', slug });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Create a new blog post (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function createBlogPost(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  tags: string[];
  isPublished: boolean;
}) {
  try {
    await requirePermission(Resource.BLOG_POSTS, Action.CREATE);

    // Generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/news');
    revalidatePath(`/blog/${slug}`);

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'createBlogPost', data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update a blog post (requires EDITOR, CONTENT_ADMIN, or SUPER_ADMIN)
 */
export async function updateBlogPost(id: string, data: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
}) {
  try {
    await requirePermission(Resource.BLOG_POSTS, Action.UPDATE);

    // Update publishedAt when publishing
    const updateData: any = { ...data };
    if (data.isPublished) {
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/blog');
    revalidatePath('/news');
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'updateBlogPost', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a blog post (requires CONTENT_ADMIN or SUPER_ADMIN)
 */
export async function deleteBlogPost(id: string) {
  try {
    await requirePermission(Resource.BLOG_POSTS, Action.DELETE);

    const post = await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/news');

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'deleteBlogPost', id });
    return { success: false, error: formatApiError(error) };
  }
}
