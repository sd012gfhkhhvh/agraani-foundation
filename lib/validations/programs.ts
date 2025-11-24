/**
 * Zod validation schemas for Programs
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

export const createProgramSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    slug: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    targets: z.string().optional().or(z.literal('')),
    impact: z.string().optional().or(z.literal('')),
    imageUrl: z.string().optional().or(z.literal('')),
    icon: z.string().optional().or(z.literal('')),
    order: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
  .transform((data) => ({
    ...data,
    slug: data.slug && data.slug.trim() ? data.slug.trim() : slugify(data.title),
  }));

export const updateProgramSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    slug: z.string().optional(),
    description: z.string().min(1).optional(),
    targets: z.string().optional().or(z.literal('')),
    impact: z.string().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    icon: z.string().optional().or(z.literal('')),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .transform((data) => ({
    ...data,
    ...(data.title && !data.slug && { slug: slugify(data.title) }),
  }));

export type CreateProgramInput = z.input<typeof createProgramSchema>;
export type UpdateProgramInput = z.input<typeof updateProgramSchema>;
