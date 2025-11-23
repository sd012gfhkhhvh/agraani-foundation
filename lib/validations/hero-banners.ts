/**
 * Zod validation schemas for Hero Banners
 */

import { z } from 'zod';

export const createHeroBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  subtitle: z
    .string()
    .max(300, 'Subtitle must be 300 characters or less')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().min(1, 'Image URL is required'),
  ctaText: z
    .string()
    .max(50, 'CTA text must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  ctaLink: z
    .string()
    .max(200, 'CTA link must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateHeroBannerSchema = createHeroBannerSchema.partial();

export type CreateHeroBannerInput = z.infer<typeof createHeroBannerSchema>;
export type UpdateHeroBannerInput = z.infer<typeof updateHeroBannerSchema>;
