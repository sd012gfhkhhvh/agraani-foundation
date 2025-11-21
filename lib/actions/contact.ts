'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError } from '@/lib/errors';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getContactSubmissions() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: submissions };
  } catch (error) {
    logError(error, { action: 'getContactSubmissions' });
    return { success: false, error: formatApiError(error) };
  }
}

export async function markSubmissionAsRead(id: string, isRead: boolean = true) {
  try {
    await requirePermission(Resource.CONTACT_SUBMISSIONS, Action.VIEW);
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath('/admin/contact-submissions');
    return { success: true, data: submission };
  } catch (error) {
    logError(error, { action: 'markSubmissionAsRead', id, isRead });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    await requirePermission(Resource.CONTACT_SUBMISSIONS, Action.DELETE);
    const submission = await prisma.contactSubmission.delete({ where: { id } });
    revalidatePath('/admin/contact-submissions');
    return { success: true, data: submission };
  } catch (error) {
    logError(error, { action: 'deleteContactSubmission', id });
    return { success: false, error: formatApiError(error) };
  }
}
