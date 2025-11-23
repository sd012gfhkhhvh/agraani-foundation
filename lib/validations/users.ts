import { UserRole } from '@prisma/client';
import { z } from 'zod';

/**
 * Schema for updating user role
 */
export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
