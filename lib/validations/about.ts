/**
 * Zod validation schemas for About content
 */

import { z } from 'zod';

export const createAboutContentSchema = z.object({
  section: z
    .string()
    .min(1, 'Section identifier is required')
    .regex(/^[a-z0-9-]+$/, {
      message: 'Section must contain only lowercase letters, numbers, and hyphens',
    }),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional().or(z.literal('')),
});

export const updateAboutContentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
  imageUrl: z.string().optional().or(z.literal('')),
});

export type CreateAboutContentInput = z.infer<typeof createAboutContentSchema>;
export type UpdateAboutContentInput = z.infer<typeof updateAboutContentSchema>;
