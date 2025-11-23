import { getLegalDocuments } from '@/lib/data/legal';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { LegalDocument } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<LegalDocument[]>>> {
  try {
    const documents = await getLegalDocuments();

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/legal' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch legal documents' },
      },
      { status: 500 }
    );
  }
}
