/**
 * Zod validation schemas for Objectives
 */

import { z } from 'zod';

export const createObjectiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or less'),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateObjectiveSchema = createObjectiveSchema.partial();

export type CreateObjectiveInput = z.infer<typeof createObjectiveSchema>;
export type UpdateObjectiveInput = z.infer<typeof updateObjectiveSchema>;
