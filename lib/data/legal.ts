/**
 * Data loader for Legal Documents
 * All database read operations for legal documents
 */

import { prisma } from '@/lib/prisma';
import type { LegalDocument } from '@/types/models';

/**
 * Get all legal documents grouped by type
 * Ordered by document type and display order
 */
export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const documents = await prisma.legalDocument.findMany({
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      documentType: true,
      validity: true,
      issueDate: true,
      expiryDate: true,
      fileUrl: true,
      notes: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ documentType: 'asc' }, { order: 'asc' }],
  });

  return documents;
}

/**
 * Get legal documents by type
 */
export async function getLegalDocumentsByType(documentType: string): Promise<LegalDocument[]> {
  const documents = await prisma.legalDocument.findMany({
    where: { documentType },
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      documentType: true,
      validity: true,
      issueDate: true,
      expiryDate: true,
      fileUrl: true,
      notes: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { order: 'asc' },
  });

  return documents;
}
