import { getContactSubmissions } from '@/lib/data/contact';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { ContactSubmission } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<ContactSubmission[]>>> {
  try {
    // Get all submissions without pagination for admin view
    const result = await getContactSubmissions(1, 1000);

    return NextResponse.json({
      success: true,
      data: result.items,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/contact-submissions' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch contact submissions' },
      },
      { status: 500 }
    );
  }
}
