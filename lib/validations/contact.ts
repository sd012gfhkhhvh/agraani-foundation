import { z } from 'zod';

/**
 * Schema for marking contact submission as read/unread
 */
export const markSubmissionAsReadSchema = z.object({
  isRead: z.boolean(),
});

export type MarkSubmissionAsReadInput = z.infer<typeof markSubmissionAsReadSchema>;
