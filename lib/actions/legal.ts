'use server';

import { getCurrentUser } from '@/lib/auth-utils';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { Action, hasPermission, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Get all legal documents
export async function getLegalDocuments() {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Resource.LEGAL_DOCUMENTS, Action.VIEW)) {
      throw new ForbiddenError('You do not have permission to view legal documents');
    }

    const documents = await prisma.legalDocument.findMany({
      orderBy: { order: 'asc' },
    });

    return { success: true, data: documents };
  } catch (error: any) {
    console.error('Error fetching legal documents:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Failed to fetch legal documents',
        statusCode: error.statusCode || 500,
      },
    };
  }
}

// Create legal document
export async function createLegalDocument(data: {
  name: string;
  documentType: string;
  registrationNumber: string;
  validity: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
  order?: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Resource.LEGAL_DOCUMENTS, Action.CREATE)) {
      throw new ForbiddenError('You do not have permission to create legal documents');
    }

    const document = await prisma.legalDocument.create({
      data: {
        name: data.name,
        documentType: data.documentType,
        registrationNumber: data.registrationNumber,
        validity: data.validity,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        fileUrl: data.fileUrl,
        notes: data.notes,
        order: data.order ?? 0,
      },
    });

    revalidatePath('/admin/legal');

    return { success: true, data: document };
  } catch (error: any) {
    console.error('Error creating legal document:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Failed to create legal document',
        statusCode: error.statusCode || 500,
      },
    };
  }
}

// Update legal document
export async function updateLegalDocument(
  id: string,
  data: {
    name?: string;
    documentType?: string;
    registrationNumber?: string;
    validity?: string;
    issueDate?: string;
    expiryDate?: string;
    fileUrl?: string;
    notes?: string;
    order?: number;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Resource.LEGAL_DOCUMENTS, Action.UPDATE)) {
      throw new ForbiddenError('You do not have permission to update legal documents');
    }

    const document = await prisma.legalDocument.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundError('Legal document not found');
    }

    const updated = await prisma.legalDocument.update({
      where: { id },
      data: {
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
    });

    revalidatePath('/admin/legal');

    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating legal document:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Failed to update legal document',
        statusCode: error.statusCode || 500,
      },
    };
  }
}

// Delete legal document
export async function deleteLegalDocument(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Resource.LEGAL_DOCUMENTS, Action.DELETE)) {
      throw new ForbiddenError('You do not have permission to delete legal documents');
    }

    const document = await prisma.legalDocument.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundError('Legal document not found');
    }

    await prisma.legalDocument.delete({ where: { id } });

    revalidatePath('/admin/legal');

    return { success: true, data: null };
  } catch (error: any) {
    console.error('Error deleting legal document:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Failed to delete legal document',
        statusCode: error.statusCode || 500,
      },
    };
  }
}
