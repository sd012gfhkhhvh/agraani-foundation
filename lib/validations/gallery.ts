/**
 * Zod validation schemas for Gallery items
 */

import { z } from 'zod';

export const createGalleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
  videoUrl: z.string().optional().or(z.literal('')),
  type: z.enum(['IMAGE', 'VIDEO']),
  category: z
    .string()
    .max(50, 'Category must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();

export type CreateGalleryItemInput = z.infer<typeof createGalleryItemSchema>;
export type UpdateGalleryItemInput = z.infer<typeof updateGalleryItemSchema>;
