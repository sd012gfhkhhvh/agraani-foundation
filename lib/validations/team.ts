/**
 * Zod validation schemas for Team members
 */

import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be 100 characters or less'),
  bio: z.string().max(2000, 'Bio must be 2000 characters or less').optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional().or(z.literal('')),
  linkedIn: z.string().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
