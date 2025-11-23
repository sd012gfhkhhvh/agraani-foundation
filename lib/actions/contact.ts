'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  markSubmissionAsReadSchema,
  type MarkSubmissionAsReadInput,
} from '@/lib/validations/contact';
import type { ApiResponse } from '@/types/api';
import type { ContactSubmission } from '@/types/models';
import { revalidatePath } from 'next/cache';

/**
 * Mark contact submission as read/unread
 * Server action - mutation only
 */
export async function markSubmissionAsRead(
  id: string,
  input: MarkSubmissionAsReadInput
): Promise<ApiResponse<ContactSubmission>> {
  try {
    const validated = markSubmissionAsReadSchema.parse(input);
    await requirePermission(Resource.CONTACT_SUBMISSIONS, Action.VIEW);

    const existing = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Contact submission');

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: validated.isRead },
    });

    revalidatePath('/admin/contact-submissions');

    return { success: true, data: submission };
  } catch (error) {
    logError(error, { action: 'markSubmissionAsRead', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete contact submission
 * Server action - mutation only
 */
export async function deleteContactSubmission(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.CONTACT_SUBMISSIONS, Action.DELETE);

    const submission = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!submission) throw new NotFoundError('Contact submission');

    await prisma.contactSubmission.delete({ where: { id } });

    revalidatePath('/admin/contact-submissions');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteContactSubmission', id });
    return { success: false, error: formatApiError(error) };
  }
}
