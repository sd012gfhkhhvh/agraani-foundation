'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
} from '@/lib/validations/blog';
import type { ApiResponse } from '@/types/api';
import type { BlogPost } from '@/types/models';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Create a new blog post
 * Server action - mutation only
 */
export async function createBlogPost(input: CreateBlogPostInput): Promise<ApiResponse<BlogPost>> {
  try {
    // Validate input (includes auto-slug generation)
    const validated = createBlogPostSchema.parse(input);

    // Check permission
    await requirePermission(Resource.BLOG_POSTS, Action.CREATE);

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return {
        success: false,
        error: { message: 'A post with this slug already exists' },
      };
    }

    // Create post
    const post = await prisma.blogPost.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt || null,
        content: validated.content,
        imageUrl: validated.imageUrl || null,
        author: validated.author,
        category: validated.category || null,
        tags: validated.tags || [],
        isPublished: validated.isPublished || false,
        publishedAt: validated.isPublished ? new Date() : null,
      },
    });

    // Revalidate pages
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath('/news');
    if (validated.isPublished) {
      revalidatePath(`/blog/${post.slug}`);
    }

    revalidateTag('blog');
    revalidateTag('news');

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'createBlogPost', input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update an existing blog post
 * Server action - mutation only
 */
export async function updateBlogPost(
  id: string,
  input: UpdateBlogPostInput
): Promise<ApiResponse<BlogPost>> {
  try {
    // Validate input
    const validated = updateBlogPostSchema.parse(input);

    // Check permission
    await requirePermission(Resource.BLOG_POSTS, Action.UPDATE);

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Blog post');
    }

    // Check if slug is changing and already exists
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validated.slug },
      });
      if (slugExists) {
        return {
          success: false,
          error: { message: 'A post with this slug already exists' },
        };
      }
    }

    // Handle publishedAt when publishing for the first time
    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.slug !== undefined) updateData.slug = validated.slug;
    if (validated.excerpt !== undefined) updateData.excerpt = validated.excerpt || null;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (validated.imageUrl !== undefined) updateData.imageUrl = validated.imageUrl || null;
    if (validated.author !== undefined) updateData.author = validated.author;
    if (validated.category !== undefined) updateData.category = validated.category || null;
    if (validated.tags !== undefined) updateData.tags = validated.tags;
    if (validated.isPublished !== undefined) {
      updateData.isPublished = validated.isPublished;
      // Set publishedAt if publishing for the first time
      if (validated.isPublished && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update post
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    // Revalidate pages
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath('/news');
    revalidatePath(`/blog/${existing.slug}`);
    if (post.slug !== existing.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    revalidateTag('blog');
    revalidateTag('news');

    return { success: true, data: post };
  } catch (error) {
    logError(error, { action: 'updateBlogPost', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a blog post
 * Server action - mutation only
 */
export async function deleteBlogPost(id: string): Promise<ApiResponse<void>> {
  try {
    // Check permission
    await requirePermission(Resource.BLOG_POSTS, Action.DELETE);

    // Check if post exists
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundError('Blog post');
    }

    // Delete post
    await prisma.blogPost.delete({
      where: { id },
    });

    // Revalidate pages
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath('/news');
    revalidatePath(`/blog/${post.slug}`);

    revalidateTag('blog');
    revalidateTag('news');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteBlogPost', id });
    return { success: false, error: formatApiError(error) };
  }
}
