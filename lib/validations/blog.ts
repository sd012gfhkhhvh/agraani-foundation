/**
 * Zod validation schemas for Blog posts
 */

import { z } from 'zod';

const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createBlogPostSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    slug: z.string().optional(),
    excerpt: z
      .string()
      .max(500, 'Excerpt must be 500 characters or less')
      .optional()
      .or(z.literal('')),
    content: z.string().min(1, 'Content is required'),
    imageUrl: z.string().optional().or(z.literal('')),
    author: z
      .string()
      .min(1, 'Author is required')
      .max(100, 'Author must be 100 characters or less'),
    category: z
      .string()
      .max(50, 'Category must be 50 characters or less')
      .optional()
      .or(z.literal('')),
    tags: z.array(z.string()).default([]),
    isPublished: z.boolean().default(false),
  })
  .transform((data) => ({
    ...data,
    // Auto-generate slug from title if not provided
    slug: data.slug && data.slug.trim() ? data.slug.trim() : slugify(data.title),
  }));

export const updateBlogPostSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    slug: z.string().optional(),
    excerpt: z.string().max(500).optional().or(z.literal('')),
    content: z.string().min(1).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    author: z.string().min(1).max(100).optional(),
    category: z.string().max(50).optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  })
  .transform((data) => ({
    ...data,
    // Update slug if title changed and slug not explicitly provided
    ...(data.title && !data.slug && { slug: slugify(data.title) }),
  }));

export type CreateBlogPostInput = z.input<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.input<typeof updateBlogPostSchema>;
