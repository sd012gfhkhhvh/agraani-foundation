/**
 * Zod validation schemas for Legal Documents
 */

import { z } from 'zod';

export const createLegalDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  registrationNumber: z.string().min(1, 'Registration number is required').max(100),
  documentType: z.string().min(1, 'Document type is required').max(50),
  validity: z.string().min(1, 'Validity is required').max(100),
  issueDate: z.string().datetime().optional().or(z.literal('')),
  expiryDate: z.string().datetime().optional().or(z.literal('')),
  fileUrl: z.string().optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
});

export const updateLegalDocumentSchema = createLegalDocumentSchema.partial();

export type CreateLegalDocumentInput = z.infer<typeof createLegalDocumentSchema>;
export type UpdateLegalDocumentInput = z.infer<typeof updateLegalDocumentSchema>;
