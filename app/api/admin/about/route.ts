import { getAboutContent } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { AboutSection } from '@/types/models';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/about
 * Fetch all about content sections for admin
 */
export async function GET(): Promise<NextResponse<ApiResponse<AboutSection[]>>> {
  try {
    const sections = await getAboutContent();

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/about' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch about content' },
      },
      { status: 500 }
    );
  }
}
