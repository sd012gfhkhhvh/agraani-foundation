'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createLegalDocumentSchema,
  updateLegalDocumentSchema,
  type CreateLegalDocumentInput,
  type UpdateLegalDocumentInput,
} from '@/lib/validations/legal';
import type { ApiResponse } from '@/types/api';
import type { LegalDocument } from '@/types/models';
import { revalidatePath } from 'next/cache';

/**
 * Create a new legal document
 * Server action - mutation only
 */
export async function createLegalDocument(
  input: CreateLegalDocumentInput
): Promise<ApiResponse<LegalDocument>> {
  try {
    // Validate input
    const validated = createLegalDocumentSchema.parse(input);

    // Check permission
    await requirePermission(Resource.LEGAL_DOCUMENTS, Action.CREATE);

    // Create document
    const document = await prisma.legalDocument.create({
      data: {
        name: validated.name,
        documentType: validated.documentType,
        registrationNumber: validated.registrationNumber,
        validity: validated.validity,
        issueDate: validated.issueDate ? new Date(validated.issueDate) : null,
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
        fileUrl: validated.fileUrl || null,
        notes: validated.notes || null,
        order: validated.order || 0,
      },
    });

    // Revalidate pages
    revalidatePath('/admin/legal');
    revalidatePath('/legal');

    return { success: true, data: document };
  } catch (error) {
    logError(error, { action: 'createLegalDocument', input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Update an existing legal document
 * Server action - mutation only
 */
export async function updateLegalDocument(
  id: string,
  input: UpdateLegalDocumentInput
): Promise<ApiResponse<LegalDocument>> {
  try {
    // Validate input
    const validated = updateLegalDocumentSchema.parse(input);

    // Check permission
    await requirePermission(Resource.LEGAL_DOCUMENTS, Action.UPDATE);

    // Check if document exists
    const document = await prisma.legalDocument.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundError('Legal document');
    }

    // Update document
    const updateData: any = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.documentType !== undefined) updateData.documentType = validated.documentType;
    if (validated.registrationNumber !== undefined)
      updateData.registrationNumber = validated.registrationNumber;
    if (validated.validity !== undefined) updateData.validity = validated.validity;
    if (validated.issueDate !== undefined) {
      updateData.issueDate = validated.issueDate ? new Date(validated.issueDate) : null;
    }
    if (validated.expiryDate !== undefined) {
      updateData.expiryDate = validated.expiryDate ? new Date(validated.expiryDate) : null;
    }
    if (validated.fileUrl !== undefined) updateData.fileUrl = validated.fileUrl || null;
    if (validated.notes !== undefined) updateData.notes = validated.notes || null;
    if (validated.order !== undefined) updateData.order = validated.order;

    const updated = await prisma.legalDocument.update({
      where: { id },
      data: updateData,
    });

    // Revalidate pages
    revalidatePath('/admin/legal');
    revalidatePath('/legal');

    return { success: true, data: updated };
  } catch (error) {
    logError(error, { action: 'updateLegalDocument', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

/**
 * Delete a legal document
 * Server action - mutation only
 */
export async function deleteLegalDocument(id: string): Promise<ApiResponse<void>> {
  try {
    // Check permission
    await requirePermission(Resource.LEGAL_DOCUMENTS, Action.DELETE);

    // Check if document exists
    const document = await prisma.legalDocument.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundError('Legal document');
    }

    // Delete document
    await prisma.legalDocument.delete({ where: { id } });

    // Revalidate pages
    revalidatePath('/admin/legal');
    revalidatePath('/legal');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteLegalDocument', id });
    return { success: false, error: formatApiError(error) };
  }
}
